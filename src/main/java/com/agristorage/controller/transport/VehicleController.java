package com.agristorage.controller.transport;

import com.agristorage.dto.request.CreateVehicleRequest;
import com.agristorage.dto.request.UpdateVehicleRequest;
import com.agristorage.entity.transport.Vehicle;
import com.agristorage.service.transport.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transport/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    public Vehicle createVehicle(@Valid @RequestBody CreateVehicleRequest request) {
        return vehicleService.createVehicle(request);
    }

    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    @GetMapping("/{id}")
    public Vehicle getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id);
    }

    @GetMapping("/transporter/{transporterId}")
    public List<Vehicle> getVehiclesByTransporterId(@PathVariable Long transporterId) {
        return vehicleService.getVehiclesByTransporterId(transporterId);
    }

    @PutMapping("/{id}")
    public Vehicle updateVehicle(@PathVariable Long id,
                                 @Valid @RequestBody UpdateVehicleRequest request) {
        return vehicleService.updateVehicle(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return "Vehicle deleted successfully";
    }
}