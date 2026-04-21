package com.agristorage.dto.request;

import com.agristorage.enums.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateVehicleRequest {

    @NotNull(message = "Transporter ID is required")
    private Long transporterId;

    @NotBlank(message = "Plate number is required")
    private String plateNumber;

    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;

    @Positive(message = "Capacity must be greater than 0")
    private Double capacity;

    private String ownershipDocumentPath;

    private Boolean active;
}