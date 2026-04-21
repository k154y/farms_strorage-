package com.agristorage.dto.request;

import com.agristorage.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateBookingStatusRequest {

    @NotNull
    private BookingStatus status;

    private Long changedByUserId;

    private String comment;
}