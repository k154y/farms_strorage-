package com.agristorage.entity.marketplace;

import com.agristorage.entity.common.BaseEntity;
import com.agristorage.enums.OrderRequestStatus;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "order_requests")
public class OrderRequest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_listing_id", nullable = false)
    private ProductListing productListing;

    @Column(name = "buyer_name", nullable = false)
    private String buyerName;

    @Column(name = "buyer_phone", nullable = false)
    private String buyerPhone;

    @Column(name = "buyer_email")
    private String buyerEmail;

    @Column(name = "requested_quantity", nullable = false)
    private Double requestedQuantity;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "delivery_location", columnDefinition = "TEXT")
    private String deliveryLocation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderRequestStatus status;
}