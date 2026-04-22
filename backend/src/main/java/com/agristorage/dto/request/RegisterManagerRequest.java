package com.agristorage.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterManagerRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Business name is required")
    private String businessName;

    private String rdbRegistrationNumber;
    private String fdaLicenseId;
    private String rsbCertificationId;
    private String ownerName;
    private String businessAddress;
    private String district;
    private String sector;
    private String contactPhone;
}