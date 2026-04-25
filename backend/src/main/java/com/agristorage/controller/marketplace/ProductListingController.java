package com.agristorage.controller.marketplace;

import com.agristorage.dto.request.AddProductImageRequest;
import com.agristorage.dto.request.CreateProductListingRequest;
import com.agristorage.dto.request.UpdateProductListingRequest;
import com.agristorage.entity.marketplace.ProductImage;
import com.agristorage.entity.marketplace.ProductListing;
import com.agristorage.service.marketplace.ProductListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/marketplace/listings")
@RequiredArgsConstructor
public class ProductListingController {

    private final ProductListingService productListingService;

    @PostMapping
    public ProductListing createListing(@Valid @RequestBody CreateProductListingRequest request) {
        return productListingService.createListing(request);
    }

    @GetMapping
    public List<ProductListing> getAllListings() {
        return productListingService.getAllListings();
    }

    @GetMapping("/{id}")
    public ProductListing getListingById(@PathVariable Long id) {
        return productListingService.getListingById(id);
    }

    @GetMapping("/farmer/{farmerId}")
    public List<ProductListing> getListingsByFarmerId(@PathVariable Long farmerId) {
        return productListingService.getListingsByFarmerId(farmerId);
    }

    @PutMapping("/{id}")
    public ProductListing updateListing(@PathVariable Long id,
                                        @Valid @RequestBody UpdateProductListingRequest request) {
        return productListingService.updateListing(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteListing(@PathVariable Long id) {
        productListingService.deleteListing(id);
        return "Product listing deleted successfully";
    }

    @PostMapping("/{listingId}/images")
    public ProductImage addImage(@PathVariable Long listingId,
                                 @Valid @RequestBody AddProductImageRequest request) {
        return productListingService.addImage(listingId, request);
    }

    @PostMapping("/{listingId}/images/upload")
    public ProductImage uploadImage(@PathVariable Long listingId,
                                    @RequestParam MultipartFile file) throws IOException {
        return productListingService.uploadImage(listingId, file);
    }

    @GetMapping("/{listingId}/images")
    public List<ProductImage> getListingImages(@PathVariable Long listingId) {
        return productListingService.getListingImages(listingId);
    }
}
