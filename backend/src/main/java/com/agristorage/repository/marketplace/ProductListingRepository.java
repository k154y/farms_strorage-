package com.agristorage.repository.marketplace;

import com.agristorage.entity.marketplace.ProductListing;
import com.agristorage.enums.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductListingRepository extends JpaRepository<ProductListing, Long> {

    List<ProductListing> findByFarmerId(Long farmerId);

    List<ProductListing> findByBookingId(Long bookingId);

    List<ProductListing> findByStatus(ListingStatus status);

    List<ProductListing> findByProduceCategoryId(Long produceCategoryId);
}