package com.agristorage.repository.transport;

import com.agristorage.entity.transport.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findByPlateNumber(String plateNumber);

    List<Vehicle> findByTransporterId(Long transporterId);

    List<Vehicle> findByActive(boolean active);
}