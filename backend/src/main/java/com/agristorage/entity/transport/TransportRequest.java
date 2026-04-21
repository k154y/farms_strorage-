package com.agristorage.entity.transport;

import com.agristorage.entity.booking.Booking;
import com.agristorage.entity.common.BaseEntity;
import com.agristorage.entity.user.User;
import com.agristorage.enums.TransportRequestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "transport_requests")
public class TransportRequest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(optional = false)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @ManyToOne
    @JoinColumn(name = "transporter_id")
    private User transporter;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Column(name = "pickup_location", nullable = false, columnDefinition = "TEXT")
    private String pickupLocation;

    @Column(name = "destination_location", nullable = false, columnDefinition = "TEXT")
    private String destinationLocation;

    @Column(name = "quantity_to_transport", nullable = false)
    private Double quantityToTransport;

    @Column(name = "preferred_pickup_date")
    private LocalDate preferredPickupDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransportRequestStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;
}