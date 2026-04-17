package com.agristorage.repository.transport;

import com.agristorage.entity.transport.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
}