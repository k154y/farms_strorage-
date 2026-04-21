
package com.agristorage.entity.user;

import com.agristorage.entity.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "farmer_farm_locations")
public class FarmerFarmLocation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "farmer_profile_id", nullable = false)
    private FarmerProfile farmerProfile;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String sector;

    private String village;

    @Column(name = "farm_location_description", columnDefinition = "TEXT")
    private String farmLocationDescription;

    private Double latitude;

    private Double longitude;
}