package com.agristorage.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateTransportRequestRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Farmer ID is required")
    private Long farmerId;

    @NotBlank(message = "Pickup location is required")
    private String pickupLocation;

    @NotBlank(message = "Destination location is required")
    private String destinationLocation;

    @NotNull(message = "Quantity to transport is required")
    @Positive(message = "Quantity must be greater than 0")
    private Double quantityToTransport;

    @FutureOrPresent(message = "Preferred pickup date cannot be in the past")
    private LocalDate preferredPickupDate;

    private String notes;
}