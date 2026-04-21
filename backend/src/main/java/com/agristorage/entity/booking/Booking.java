package com.agristorage.entity.booking;

import com.agristorage.entity.common.BaseEntity;
import com.agristorage.entity.storage.ColdRoom;
import com.agristorage.entity.storage.ProduceCategory;
import com.agristorage.entity.storage.StorageFacility;
import com.agristorage.entity.user.User;
import com.agristorage.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "bookings")
public class Booking extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @ManyToOne(optional = false)
    @JoinColumn(name = "facility_id", nullable = false)
    private StorageFacility facility;

    @ManyToOne(optional = false)
    @JoinColumn(name = "cold_room_id", nullable = false)
    private ColdRoom coldRoom;

    @ManyToOne(optional = false)
    @JoinColumn(name = "produce_category_id", nullable = false)
    private ProduceCategory produceCategory;

    @Column(nullable = false)
    private Double quantity;

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @Column(name = "expected_duration_days", nullable = false)
    private Integer expectedDurationDays;

    @Column(name = "price_at_booking", nullable = false)
    private Double priceAtBooking;

    @Column(name = "total_estimated_cost", nullable = false)
    private Double totalEstimatedCost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;
}