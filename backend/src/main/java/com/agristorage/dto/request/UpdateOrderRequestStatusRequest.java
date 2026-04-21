package com.agristorage.dto.request;

import com.agristorage.enums.OrderRequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrderRequestStatusRequest {

    @NotNull(message = "Status is required")
    private OrderRequestStatus status;
}