package com.agristorage.dto.request;

import com.agristorage.enums.TransportRequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTransportStatusRequest {

    @NotNull(message = "Status is required")
    private TransportRequestStatus status;

    private Long changedByUserId;

    private String comment;
}