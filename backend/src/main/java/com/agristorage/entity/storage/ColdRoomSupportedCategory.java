package com.agristorage.entity.storage;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "cold_room_supported_categories",
       uniqueConstraints = @UniqueConstraint(columnNames = {"cold_room_id", "produce_category_id"}))
public class ColdRoomSupportedCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cold_room_id", nullable = false)
    private ColdRoom coldRoom;

    @ManyToOne(optional = false)
    @JoinColumn(name = "produce_category_id", nullable = false)
    private ProduceCategory produceCategory;
}