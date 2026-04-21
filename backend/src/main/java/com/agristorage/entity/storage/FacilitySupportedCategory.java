package com.agristorage.entity.storage;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "facility_supported_categories",
       uniqueConstraints = @UniqueConstraint(columnNames = {"facility_id", "produce_category_id"}))
public class FacilitySupportedCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "facility_id", nullable = false)
    private StorageFacility facility;

    @ManyToOne(optional = false)
    @JoinColumn(name = "produce_category_id", nullable = false)
    private ProduceCategory produceCategory;
}