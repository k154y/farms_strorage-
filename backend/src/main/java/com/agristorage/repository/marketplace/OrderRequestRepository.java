package com.agristorage.repository.marketplace;

import com.agristorage.entity.marketplace.OrderRequest;
import com.agristorage.enums.OrderRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRequestRepository extends JpaRepository<OrderRequest, Long> {

    List<OrderRequest> findByProductListingId(Long productListingId);

    List<OrderRequest> findByStatus(OrderRequestStatus status);
}