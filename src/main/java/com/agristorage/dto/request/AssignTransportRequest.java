package com.agristorage.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignTransportRequest {

    @NotNull(message = "Transporter ID is required")
    private Long transporterId;

    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;

    private Long changedByUserId;

    private String comment;
}