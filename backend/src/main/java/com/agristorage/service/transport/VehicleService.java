package com.agristorage.service.transport;

import com.agristorage.dto.request.CreateVehicleRequest;
import com.agristorage.dto.request.UpdateVehicleRequest;
import com.agristorage.entity.transport.Vehicle;
import com.agristorage.entity.user.TransporterProfile;
import com.agristorage.entity.user.User;
import com.agristorage.enums.Role;
import com.agristorage.repository.transport.VehicleRepository;
import com.agristorage.repository.user.TransporterProfileRepository;
import com.agristorage.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final TransporterProfileRepository transporterProfileRepository;

    public Vehicle createVehicle(CreateVehicleRequest request) {
        User transporter = userRepository.findById(request.getTransporterId())
                .orElseThrow(() -> new RuntimeException("Transporter not found with id: " + request.getTransporterId()));

        if (transporter.getRole() != Role.TRANSPORTER) {
            throw new RuntimeException("User is not a transporter");
        }

        TransporterProfile profile = transporterProfileRepository.findByUser(transporter)
                .orElseThrow(() -> new RuntimeException("Transporter profile not found"));

        if (!isProfileComplete(profile)) {
            throw new RuntimeException("Complete your transporter profile before adding a vehicle.");
        }

        vehicleRepository.findByPlateNumber(request.getPlateNumber()).ifPresent(vehicle -> {
            throw new RuntimeException("Vehicle with this plate number already exists");
        });

        Vehicle vehicle = Vehicle.builder()
                .transporter(transporter)
                .plateNumber(request.getPlateNumber())
                .vehicleType(request.getVehicleType())
                .capacity(request.getCapacity())
                .ownershipDocumentPath(request.getOwnershipDocumentPath())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
    }

    public List<Vehicle> getVehiclesByTransporterId(Long transporterId) {
        return vehicleRepository.findByTransporterId(transporterId);
    }

    public Vehicle updateVehicle(Long id, UpdateVehicleRequest request) {
        Vehicle vehicle = getVehicleById(id);

        vehicleRepository.findByPlateNumber(request.getPlateNumber()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new RuntimeException("Another vehicle with this plate number already exists");
            }
        });

        vehicle.setPlateNumber(request.getPlateNumber());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setCapacity(request.getCapacity());
        vehicle.setOwnershipDocumentPath(request.getOwnershipDocumentPath());

        if (request.getActive() != null) {
            vehicle.setActive(request.getActive());
        }

        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }

    private boolean isProfileComplete(TransporterProfile profile) {
        return hasText(profile.getBusinessName())
                && hasText(profile.getDrivingLicenseNumber())
                && hasText(profile.getDistrict())
                && hasText(profile.getSector())
                && hasText(profile.getContactPhone());
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
