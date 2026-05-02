package com.agristorage.dto.request;

import com.agristorage.enums.Role;
import com.agristorage.enums.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GoogleRegisterRequest {

    @NotBlank(message = "Google ID token is required")
    private String idToken;

    @NotNull(message = "Role is required")
    private Role role;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private String businessName;
    private String ownerName;
    private String contactPhone;
    private String drivingLicenseNumber;
    private String district;
    private String sector;
    private String village;
    private String farmLocationDescription;
    private Double latitude;
    private Double longitude;
    private List<String> preferredProduceTypes;
    private String rdbRegistrationNumber;
    private String fdaLicenseId;
    private String rsbCertificationId;
    private String businessAddress;
    private String ruraCertificateId;
    private String commercialInsurance;
    private String ownershipDetails;
    private String vehiclePlateNumber;
    private VehicleType vehicleType;
    private Double vehicleCapacity;
}
