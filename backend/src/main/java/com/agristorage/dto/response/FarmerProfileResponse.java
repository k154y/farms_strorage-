package com.agristorage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class FarmerProfileResponse {
    private Long profileId;
    private Long userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String status;
    private List<FarmerFarmLocationResponse> locations;
}
