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
@Table(name = "transporter_profiles")
public class TransporterProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "business_name")
    private String businessName;

    @Column(name = "driving_license_number")
    private String drivingLicenseNumber;

    @Column(name = "ruracertificate_id")
    private String ruraCertificateId;

    @Column(name = "commercial_insurance")
    private String commercialInsurance;

    @Column(name = "ownership_details", columnDefinition = "TEXT")
    private String ownershipDetails;

    private String district;
    private String sector;

    @Column(name = "contact_phone")
    private String contactPhone;
}