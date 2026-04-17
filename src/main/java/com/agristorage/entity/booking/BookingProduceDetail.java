package com.agristorage.entity.booking;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "booking_produce_details")
public class BookingProduceDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Column(name = "produce_name")
    private String produceName;

    @Column(name = "quality_grade")
    private String qualityGrade;

    @Column(name = "packaging_type")
    private String packagingType;

    @Column(name = "harvest_date")
    private LocalDate harvestDate;

    @Column(name = "delivery_note", columnDefinition = "TEXT")
    private String deliveryNote;

    @Column(columnDefinition = "TEXT")
    private String notes;
}