package com.agristorage.repository.marketplace;

import com.agristorage.entity.marketplace.ProductListing;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductListingRepository extends JpaRepository<ProductListing, Long> {
}