package com.agristorage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TransporterProfileResponse {
    private Long profileId;
    private Long userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String status;
    private String businessName;
    private String drivingLicenseNumber;
    private String district;
    private String sector;
    private String contactPhone;
    private String ruraCertificateId;
    private String commercialInsurance;
    private String ownershipDetails;
    private boolean profileComplete;
}
