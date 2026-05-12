package com.agristorage.repository.marketplace;

import com.agristorage.entity.marketplace.OrderRequest;
import com.agristorage.enums.OrderRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRequestRepository extends JpaRepository<OrderRequest, Long> {

    List<OrderRequest> findByProductListingId(Long productListingId);
    List<OrderRequest> findByProductListingFarmerId(Long farmerId);

    List<OrderRequest> findByStatus(OrderRequestStatus status);

    void deleteByProductListingId(Long productListingId);
}
