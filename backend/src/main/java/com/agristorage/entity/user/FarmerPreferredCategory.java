package com.agristorage.entity.user;

import com.agristorage.entity.storage.ProduceCategory;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "farmer_preferred_categories",
       uniqueConstraints = @UniqueConstraint(columnNames = {"farmer_profile_id", "produce_category_id"}))
public class FarmerPreferredCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "farmer_profile_id", nullable = false)
    private FarmerProfile farmerProfile;

    @ManyToOne(optional = false)
    @JoinColumn(name = "produce_category_id", nullable = false)
    private ProduceCategory produceCategory;
}