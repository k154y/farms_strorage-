package com.agristorage.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStorageManagerProfileRequest {
    private Long userId;
    private String fullName;
    private String phoneNumber;
    private String businessName;
    private String ownerName;
    private String district;
    private String sector;
    private String contactPhone;
    private String businessAddress;
    private String rdbRegistrationNumber;
    private String fdaLicenseId;
    private String rsbCertificationId;
}
