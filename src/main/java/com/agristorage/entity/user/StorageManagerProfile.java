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
@Table(name = "storage_manager_profiles")
public class StorageManagerProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "business_name", nullable = false)
    private String businessName;

    @Column(name = "rdb_registration_number")
    private String rdbRegistrationNumber;

    @Column(name = "fda_license_id")
    private String fdaLicenseId;

    @Column(name = "rsb_certification_id")
    private String rsbCertificationId;

    @Column(name = "owner_name")
    private String ownerName;

    @Column(name = "business_address", columnDefinition = "TEXT")
    private String businessAddress;

    private String district;
    private String sector;

    @Column(name = "contact_phone")
    private String contactPhone;
}