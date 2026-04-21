package com.agristorage.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateStorageFacilityRequest {

    @NotNull(message = "Manager ID is required")
    private Long managerId;

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