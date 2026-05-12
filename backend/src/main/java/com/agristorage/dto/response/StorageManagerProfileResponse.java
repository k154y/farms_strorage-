package com.agristorage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StorageManagerProfileResponse {
    private Long profileId;
    private Long userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String status;
    private String businessName;
    private String ownerName;
    private String district;
    private String sector;
    private String contactPhone;
    private String businessAddress;
    private String rdbRegistrationNumber;
    private String fdaLicenseId;
    private String rsbCertificationId;
    private boolean profileComplete;
}
