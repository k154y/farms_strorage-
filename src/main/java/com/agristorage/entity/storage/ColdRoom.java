package com.agristorage.entity.storage;

import com.agristorage.entity.common.BaseEntity;
import com.agristorage.enums.PricingType;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "cold_rooms",
       uniqueConstraints = @UniqueConstraint(columnNames = {"facility_id", "code"}))
public class ColdRoom extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "facility_id", nullable = false)
    private StorageFacility facility;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(name = "total_capacity", nullable = false)
    private Double totalCapacity;

    @Column(name = "available_capacity", nullable = false)
    private Double availableCapacity;

    @Column(name = "min_temperature")
    private Double minTemperature;

    @Column(name = "max_temperature")
    private Double maxTemperature;

    @Enumerated(EnumType.STRING)
    @Column(name = "pricing_type", nullable = false)
    private PricingType pricingType;

    @Column(name = "price_per_unit", nullable = false)
    private Double pricePerUnit;

    @Column(nullable = false)
    private boolean active;
}