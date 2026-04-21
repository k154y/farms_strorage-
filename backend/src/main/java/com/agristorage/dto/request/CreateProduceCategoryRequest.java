package com.agristorage.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateProduceCategoryRequest {

    @NotBlank(message = "Category name is required")
    private String name;

    private String description;

    private Double recommendedMinTemperature;

    private Double recommendedMaxTemperature;

    private Boolean active;
}