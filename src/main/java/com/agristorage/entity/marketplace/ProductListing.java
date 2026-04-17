package com.agristorage.entity.marketplace;

import com.agristorage.entity.booking.Booking;
import com.agristorage.entity.common.BaseEntity;
import com.agristorage.entity.storage.ProduceCategory;
import com.agristorage.entity.user.User;
import com.agristorage.enums.ListingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "product_listings")
public class ProductListing extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @ManyToOne(optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(optional = false)
    @JoinColumn(name = "produce_category_id", nullable = false)
    private ProduceCategory produceCategory;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "quantity_available", nullable = false)
    private Double quantityAvailable;

    @Column(nullable = false)
    private String unit;

    @Column(nullable = false)
    private Double price;

    @Column(name = "quality_status")
    private String qualityStatus;

    @Column(name = "harvest_date")
    private LocalDate harvestDate;

    @Column(name = "listing_expiry_date")
    private LocalDate listingExpiryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingStatus status;
}