package com.agristorage.entity.storage;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "produce_categories")
public class ProduceCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "recommended_min_temperature")
    private Double recommendedMinTemperature;

    @Column(name = "recommended_max_temperature")
    private Double recommendedMaxTemperature;

    @Column(nullable = false)
    private boolean active;
}