package com.agristorage.repository.marketplace;

import com.agristorage.entity.marketplace.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    List<ProductImage> findByProductListingId(Long productListingId);

    void deleteByProductListingId(Long productListingId);
}
