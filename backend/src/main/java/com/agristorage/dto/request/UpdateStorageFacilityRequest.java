package com.agristorage.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStorageFacilityRequest {

    @NotBlank(message = "Facility name is required")
    private String name;

    @NotBlank(message = "District is required")
    private String district;

    private String sector;
    private String address;
    private Double latitude;
    private Double longitude;
    private String description;
    private String contactPhone;

    @Email(message = "Invalid email format")
    private String contactEmail;

    private Boolean active;
}