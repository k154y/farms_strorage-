package com.agristorage.service.transport;

import com.agristorage.dto.request.AssignTransportRequest;
import com.agristorage.dto.request.CreateTransportRequestRequest;
import com.agristorage.dto.request.UpdateTransportStatusRequest;
import com.agristorage.entity.booking.Booking;
import com.agristorage.entity.transport.TransportRequest;
import com.agristorage.entity.transport.TransportStatusHistory;
import com.agristorage.entity.transport.Vehicle;
import com.agristorage.entity.user.User;
import com.agristorage.enums.Role;
import com.agristorage.enums.TransportRequestStatus;
import com.agristorage.repository.booking.BookingRepository;
import com.agristorage.repository.transport.TransportRequestRepository;
import com.agristorage.repository.transport.TransportStatusHistoryRepository;
import com.agristorage.repository.transport.VehicleRepository;
import com.agristorage.repository.user.UserRepository;
import com.agristorage.service.user.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransportRequestService {

    private final TransportRequestRepository transportRequestRepository;
    private final TransportStatusHistoryRepository historyRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final NotificationService notificationService;

    public TransportRequest createTransportRequest(CreateTransportRequestRequest request) {
        User farmer = userRepository.findById(request.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found with id: " + request.getFarmerId()));

        if (farmer.getRole() != Role.FARMER) {
            throw new RuntimeException("User is not a farmer");
        }

        Booking booking = null;
        if (request.getBookingId() != null) {
            booking = bookingRepository.findById(request.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + request.getBookingId()));

            if (!booking.getFarmer().getId().equals(farmer.getId())) {
                throw new RuntimeException("Farmer does not own this booking");
            }

            if (request.getQuantityToTransport() > booking.getQuantity()) {
                throw new RuntimeException("Quantity to transport cannot exceed booking quantity");
            }
        }

        TransportRequest transportRequest = TransportRequest.builder()
                .booking(booking)
                .farmer(farmer)
                .pickupLocation(request.getPickupLocation())
                .destinationLocation(request.getDestinationLocation())
                .quantityToTransport(request.getQuantityToTransport())
                .preferredPickupDate(request.getPreferredPickupDate())
                .status(TransportRequestStatus.PENDING)
                .notes(request.getNotes())
                .build();

        return transportRequestRepository.save(transportRequest);
    }

    public List<TransportRequest> getAllTransportRequests() {
        return transportRequestRepository.findAll();
    }

    public TransportRequest getTransportRequestById(Long id) {
        return transportRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transport request not found with id: " + id));
    }

    public List<TransportRequest> getByBookingId(Long bookingId) {
        return transportRequestRepository.findByBookingId(bookingId);
    }

    public List<TransportRequest> getByFarmerId(Long farmerId) {
        return transportRequestRepository.findByFarmerId(farmerId);
    }

    public List<TransportRequest> getByTransporterId(Long transporterId) {
        return transportRequestRepository.findByTransporterId(transporterId);
    }

    public List<TransportRequest> getAvailableRequestsForTransporter(Long transporterId) {
        User transporter = userRepository.findById(transporterId)
                .orElseThrow(() -> new RuntimeException("Transporter not found with id: " + transporterId));

        if (transporter.getRole() != Role.TRANSPORTER) {
            throw new RuntimeException("User is not a transporter");
        }

        List<Vehicle> activeVehicles = vehicleRepository.findByTransporterIdAndActiveTrue(transporterId);
        if (activeVehicles.isEmpty()) {
            return List.of();
        }

        return transportRequestRepository.findByStatusAndTransporterIsNull(TransportRequestStatus.PENDING)
                .stream()
                .filter(request -> activeVehicles.stream()
                        .anyMatch(vehicle -> vehicle.getCapacity() != null
                                && vehicle.getCapacity() >= request.getQuantityToTransport()))
                .toList();
    }

    @Transactional
    public TransportRequest assignTransportRequest(Long transportRequestId, AssignTransportRequest request) {
        TransportRequest transportRequest = transportRequestRepository.findWithLockById(transportRequestId)
                .orElseThrow(() -> new RuntimeException("Transport request not found with id: " + transportRequestId));

        User transporter = userRepository.findById(request.getTransporterId())
                .orElseThrow(() -> new RuntimeException("Transporter not found with id: " + request.getTransporterId()));

        if (transporter.getRole() != Role.TRANSPORTER) {
            throw new RuntimeException("User is not a transporter");
        }

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + request.getVehicleId()));

        if (!vehicle.getTransporter().getId().equals(transporter.getId())) {
            throw new RuntimeException("Vehicle does not belong to this transporter");
        }

        if (!vehicle.isActive()) {
            throw new RuntimeException("Selected vehicle is not active");
        }

        if (vehicle.getCapacity() == null || vehicle.getCapacity() < transportRequest.getQuantityToTransport()) {
            throw new RuntimeException("Selected vehicle does not meet the transport quantity requirement");
        }

        TransportRequestStatus oldStatus = transportRequest.getStatus();

        if (oldStatus != TransportRequestStatus.PENDING || transportRequest.getTransporter() != null) {
            throw new RuntimeException("This transport request has already been accepted by another transporter");
        }

        transportRequest.setTransporter(transporter);
        transportRequest.setVehicle(vehicle);
        transportRequest.setStatus(TransportRequestStatus.ASSIGNED);

        saveHistory(transportRequest, oldStatus, TransportRequestStatus.ASSIGNED, request.getChangedByUserId(), request.getComment());

        notificationService.createNotification(
                transportRequest.getFarmer().getId(),
                "Transport Request Assigned",
                "Your transport request #" + transportRequest.getId() + " has been accepted by a transporter.",
                "TRANSPORT_ASSIGNED"
        );

        return transportRequestRepository.save(transportRequest);
    }

    public TransportRequest updateStatus(Long transportRequestId, UpdateTransportStatusRequest request) {
        TransportRequest transportRequest = getTransportRequestById(transportRequestId);

        TransportRequestStatus oldStatus = transportRequest.getStatus();
        TransportRequestStatus newStatus = request.getStatus();

        validateStatusTransition(oldStatus, newStatus);

        transportRequest.setStatus(newStatus);

        saveHistory(transportRequest, oldStatus, newStatus, request.getChangedByUserId(), request.getComment());

        return transportRequestRepository.save(transportRequest);
    }

    public List<TransportStatusHistory> getHistory(Long transportRequestId) {
        getTransportRequestById(transportRequestId);
        return historyRepository.findByTransportRequestId(transportRequestId);
    }

    public void deleteTransportRequest(Long id) {
        TransportRequest transportRequest = getTransportRequestById(id);
        transportRequestRepository.delete(transportRequest);
    }

    private void saveHistory(TransportRequest transportRequest,
                             TransportRequestStatus oldStatus,
                             TransportRequestStatus newStatus,
                             Long changedByUserId,
                             String comment) {

        User changedByUser = null;

        if (changedByUserId != null) {
            changedByUser = userRepository.findById(changedByUserId)
                    .orElseThrow(() -> new RuntimeException("Changed-by user not found with id: " + changedByUserId));
        }

        TransportStatusHistory history = TransportStatusHistory.builder()
                .transportRequest(transportRequest)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .changedByUser(changedByUser)
                .comment(comment)
                .build();

        historyRepository.save(history);
    }

    private void validateStatusTransition(TransportRequestStatus oldStatus, TransportRequestStatus newStatus) {
        if (oldStatus == newStatus) {
            throw new RuntimeException("Transport request is already in status: " + newStatus);
        }

        switch (oldStatus) {
            case PENDING -> {
                if (newStatus != TransportRequestStatus.ASSIGNED && newStatus != TransportRequestStatus.CANCELLED) {
                    throw new RuntimeException("Invalid status transition from PENDING to " + newStatus);
                }
            }
            case ASSIGNED -> {
                if (newStatus != TransportRequestStatus.ACCEPTED && newStatus != TransportRequestStatus.CANCELLED) {
                    throw new RuntimeException("Invalid status transition from ASSIGNED to " + newStatus);
                }
            }
            case ACCEPTED -> {
                if (newStatus != TransportRequestStatus.PICKED_UP && newStatus != TransportRequestStatus.CANCELLED) {
                    throw new RuntimeException("Invalid status transition from ACCEPTED to " + newStatus);
                }
            }
            case PICKED_UP -> {
                if (newStatus != TransportRequestStatus.DELIVERED) {
                    throw new RuntimeException("Invalid status transition from PICKED_UP to " + newStatus);
                }
            }
            case DELIVERED -> {
                if (newStatus != TransportRequestStatus.COMPLETED) {
                    throw new RuntimeException("Invalid status transition from DELIVERED to " + newStatus);
                }
            }
            case COMPLETED, CANCELLED -> throw new RuntimeException("No further status changes allowed from " + oldStatus);
        }
    }
}
