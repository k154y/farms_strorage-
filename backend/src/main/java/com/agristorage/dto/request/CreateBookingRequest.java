package com.agristorage.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateBookingRequest {

    @NotNull
    private Long farmerId;

    @NotNull
    private Long facilityId;

    @NotNull
    private Long coldRoomId;

    @NotNull
    private Long produceCategoryId;

    @NotNull
    @Positive
    private Double quantity;

    @NotNull
    private LocalDate entryDate;

    @NotNull
    @Positive
    private Integer expectedDurationDays;
}
