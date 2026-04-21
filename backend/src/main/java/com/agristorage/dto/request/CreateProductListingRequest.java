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
public class CreateProductListingRequest {

    @NotNull(message = "Farmer ID is required")
    private Long farmerId;

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Produce category ID is required")
    private Long produceCategoryId;

    @NotBlank(message = "Listing name is required")
    private String name;

    private String description;

    @NotNull(message = "Quantity available is required")
    @Positive(message = "Quantity available must be greater than 0")
    private Double quantityAvailable;

    @NotBlank(message = "Unit is required")
    private String unit;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be greater than 0")
    private Double price;

    private String qualityStatus;

    private LocalDate harvestDate;

    @FutureOrPresent(message = "Listing expiry date cannot be in the past")
    private LocalDate listingExpiryDate;
}