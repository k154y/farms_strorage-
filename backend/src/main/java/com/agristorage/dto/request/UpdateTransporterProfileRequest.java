package com.agristorage.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTransporterProfileRequest {
    private Long userId;
    private String fullName;
    private String phoneNumber;
    private String businessName;
    private String drivingLicenseNumber;
    private String district;
    private String sector;
    private String contactPhone;
    private String ruraCertificateId;
    private String commercialInsurance;
    private String ownershipDetails;
}
