package com.agristorage.dto.request;

import com.agristorage.enums.PricingType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UpdateColdRoomRequest {

    @NotBlank(message = "Room code is required")
    private String code;

    @NotBlank(message = "Room name is required")
    private String name;

    @NotNull(message = "Total capacity is required")
    @Positive(message = "Total capacity must be greater than 0")
    private Double totalCapacity;

    @NotNull(message = "Available capacity is required")
    @Positive(message = "Available capacity must be greater than 0")
    private Double availableCapacity;

    private Double minTemperature;
    private Double maxTemperature;

    @NotNull(message = "Pricing type is required")
    private PricingType pricingType;

    @NotNull(message = "Price per unit is required")
    @Positive(message = "Price per unit must be greater than 0")
    private Double pricePerUnit;

    private Boolean active;

    private List<Long> supportedCategoryIds;
}
