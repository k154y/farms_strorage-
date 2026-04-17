package com.agristorage.repository.marketplace;

import com.agristorage.entity.marketplace.OrderRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRequestRepository extends JpaRepository<OrderRequest, Long> {
}