package com.agristorage.service.booking;

import com.agristorage.dto.request.CreateBookingRequest;
import com.agristorage.dto.request.UpdateBookingStatusRequest;
import com.agristorage.entity.booking.Booking;
import com.agristorage.entity.booking.BookingStatusHistory;
import com.agristorage.entity.storage.ColdRoom;
import com.agristorage.entity.storage.ProduceCategory;
import com.agristorage.entity.storage.StorageFacility;
import com.agristorage.entity.user.User;
import com.agristorage.enums.BookingStatus;
import com.agristorage.enums.Role;
import com.agristorage.repository.booking.BookingRepository;
import com.agristorage.repository.booking.BookingStatusHistoryRepository;
import com.agristorage.repository.storage.ColdRoomRepository;
import com.agristorage.repository.storage.ProduceCategoryRepository;
import com.agristorage.repository.storage.StorageFacilityRepository;
import com.agristorage.repository.user.UserRepository;
import com.agristorage.service.common.AuditLogService;
import com.agristorage.service.user.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingStatusHistoryRepository historyRepository;

    private final UserRepository userRepository;
    private final StorageFacilityRepository facilityRepository;
    private final ColdRoomRepository coldRoomRepository;
    private final ProduceCategoryRepository categoryRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    // CREATE BOOKING
    public Booking createBooking(CreateBookingRequest request) {

        User farmer = userRepository.findById(request.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        if (farmer.getRole() != Role.FARMER) {
            throw new RuntimeException("User is not a farmer");
        }

        StorageFacility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        ColdRoom coldRoom = coldRoomRepository.findById(request.getColdRoomId())
                .orElseThrow(() -> new RuntimeException("Cold room not found"));

        if (!coldRoom.getFacility().getId().equals(facility.getId())) {
            throw new RuntimeException("Cold room does not belong to this facility");
        }

        ProduceCategory category = categoryRepository.findById(request.getProduceCategoryId())
                .orElseThrow(() -> new RuntimeException("Produce category not found"));

        if (request.getQuantity() > coldRoom.getAvailableCapacity()) {
            throw new RuntimeException("Not enough available capacity");
        }

        Booking booking = Booking.builder()
                .farmer(farmer)
                .facility(facility)
                .coldRoom(coldRoom)
                .produceCategory(category)
                .quantity(request.getQuantity())
                .entryDate(request.getEntryDate())
                .expectedDurationDays(request.getExpectedDurationDays())
                .priceAtBooking(coldRoom.getPricePerUnit())
                .totalEstimatedCost(request.getQuantity() * coldRoom.getPricePerUnit())
                .status(BookingStatus.PENDING)
                .build();

        return bookingRepository.save(booking);
    }

    // GET ALL
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByFarmerId(Long farmerId) {
        return bookingRepository.findByFarmerId(farmerId);
    }

    public List<Booking> getBookingsByManagerId(Long managerId) {
        return bookingRepository.findByFacilityManagerId(managerId);
    }

    // GET BY ID
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public List<BookingStatusHistory> getHistory(Long bookingId) {
        getBookingById(bookingId);
        return historyRepository.findByBookingId(bookingId);
    }

    // UPDATE STATUS
    public Booking updateStatus(Long bookingId, UpdateBookingStatusRequest request) {

        Booking booking = getBookingById(bookingId);

        BookingStatus oldStatus = booking.getStatus();
        BookingStatus newStatus = request.getStatus();

        validateStatusTransition(oldStatus, newStatus);

        booking.setStatus(newStatus);

        // capacity logic
        if (newStatus == BookingStatus.APPROVED) {
            ColdRoom room = booking.getColdRoom();
            if (room.getAvailableCapacity() < booking.getQuantity()) {
                throw new RuntimeException("The selected cold room no longer has enough capacity for this booking");
            }
            room.setAvailableCapacity(room.getAvailableCapacity() - booking.getQuantity());
            coldRoomRepository.save(room);
        }

        if (oldStatus == BookingStatus.APPROVED && newStatus == BookingStatus.CANCELLED) {
            ColdRoom room = booking.getColdRoom();
            room.setAvailableCapacity(room.getAvailableCapacity() + booking.getQuantity());
            coldRoomRepository.save(room);
        }

        // history
        BookingStatusHistory history = BookingStatusHistory.builder()
                .booking(booking)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .comment(request.getComment())
                .build();

        historyRepository.save(history);
        Booking saved = bookingRepository.save(booking);

        notificationService.createNotification(
                booking.getFarmer().getId(),
                "Booking Status Updated",
                "Your booking #" + booking.getId() + " is now " + newStatus.name() + ".",
                "GENERAL"
        );
        auditLogService.log(booking.getFarmer().getId(), "BOOKING_" + newStatus.name(), "BOOKING", booking.getId(), request.getComment());

        return saved;
    }

    public void deleteBooking(Long id) {
        Booking booking = getBookingById(id);
        bookingRepository.delete(booking);
    }

    private void validateStatusTransition(BookingStatus oldStatus, BookingStatus newStatus) {
        if (oldStatus == newStatus) {
            return;
        }

        switch (oldStatus) {
            case PENDING -> {
                if (newStatus != BookingStatus.APPROVED
                        && newStatus != BookingStatus.REJECTED
                        && newStatus != BookingStatus.CANCELLED) {
                    throw new RuntimeException("PENDING bookings can only move to APPROVED, REJECTED, or CANCELLED");
                }
            }
            case APPROVED -> {
                if (newStatus != BookingStatus.DELIVERED
                        && newStatus != BookingStatus.CANCELLED) {
                    throw new RuntimeException("APPROVED bookings can only move to DELIVERED or CANCELLED");
                }
            }
            case DELIVERED -> {
                if (newStatus != BookingStatus.IN_STORAGE) {
                    throw new RuntimeException("DELIVERED bookings can only move to IN_STORAGE");
                }
            }
            case IN_STORAGE -> {
                if (newStatus != BookingStatus.COMPLETED) {
                    throw new RuntimeException("IN_STORAGE bookings can only move to COMPLETED");
                }
            }
            case REJECTED, CANCELLED, COMPLETED ->
                    throw new RuntimeException(oldStatus.name() + " bookings cannot be changed further");
            default -> throw new RuntimeException("Unsupported booking status transition");
        }
    }
}
