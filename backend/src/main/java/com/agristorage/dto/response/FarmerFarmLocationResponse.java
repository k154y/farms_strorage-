package com.agristorage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FarmerFarmLocationResponse {
    private Long id;
    private String district;
    private String sector;
    private String village;
    private String farmLocationDescription;
    private Double latitude;
    private Double longitude;
}
