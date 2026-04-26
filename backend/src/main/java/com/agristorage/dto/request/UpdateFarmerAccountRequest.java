package com.agristorage.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateFarmerAccountRequest {
    private Long userId;
    private String fullName;
    private String phoneNumber;
}
