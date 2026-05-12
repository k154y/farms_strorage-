package com.agristorage.service.marketplace;

import com.agristorage.dto.request.AddProductImageRequest;
import com.agristorage.dto.request.CreateProductListingRequest;
import com.agristorage.dto.request.UpdateProductListingRequest;
import com.cloudinary.Cloudinary;
import com.agristorage.entity.booking.Booking;
import com.agristorage.entity.marketplace.ProductImage;
import com.agristorage.entity.marketplace.ProductListing;
import com.agristorage.entity.storage.ProduceCategory;
import com.agristorage.entity.user.User;
import com.agristorage.enums.ListingStatus;
import com.agristorage.enums.Role;
import com.agristorage.repository.booking.BookingRepository;
import com.agristorage.repository.marketplace.OrderRequestRepository;
import com.agristorage.repository.marketplace.ProductImageRepository;
import com.agristorage.repository.marketplace.ProductListingRepository;
import com.agristorage.repository.storage.ProduceCategoryRepository;
import com.agristorage.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductListingService {

    private final ProductListingRepository productListingRepository;
    private final ProductImageRepository productImageRepository;
    private final OrderRequestRepository orderRequestRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ProduceCategoryRepository produceCategoryRepository;
    private final Cloudinary cloudinary;

    public ProductListing createListing(CreateProductListingRequest request) {
        User farmer = userRepository.findById(request.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found with id: " + request.getFarmerId()));

        if (farmer.getRole() != Role.FARMER) {
            throw new RuntimeException("User is not a farmer");
        }

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + request.getBookingId()));

        if (!booking.getFarmer().getId().equals(farmer.getId())) {
            throw new RuntimeException("Farmer does not own this booking");
        }

        ProduceCategory produceCategory = produceCategoryRepository.findById(request.getProduceCategoryId())
                .orElseThrow(() -> new RuntimeException("Produce category not found with id: " + request.getProduceCategoryId()));

        if (request.getQuantityAvailable() > booking.getQuantity()) {
            throw new RuntimeException("Listing quantity cannot exceed booking quantity");
        }

        ProductListing listing = ProductListing.builder()
                .farmer(farmer)
                .booking(booking)
                .produceCategory(produceCategory)
                .name(request.getName())
                .description(request.getDescription())
                .quantityAvailable(request.getQuantityAvailable())
                .unit(request.getUnit())
                .price(request.getPrice())
                .qualityStatus(request.getQualityStatus())
                .harvestDate(request.getHarvestDate())
                .listingExpiryDate(request.getListingExpiryDate())
                .status(ListingStatus.ACTIVE)
                .build();

        return productListingRepository.save(listing);
    }

    public List<ProductListing> getAllListings() {
        return productListingRepository.findByStatus(ListingStatus.ACTIVE);
    }

    public ProductListing getListingById(Long id) {
        return productListingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product listing not found with id: " + id));
    }

    public List<ProductListing> getListingsByFarmerId(Long farmerId) {
        return productListingRepository.findByFarmerId(farmerId);
    }

    public ProductListing updateListing(Long id, UpdateProductListingRequest request) {
        ProductListing listing = getListingById(id);

        if (request.getQuantityAvailable() > listing.getBooking().getQuantity()) {
            throw new RuntimeException("Listing quantity cannot exceed booking quantity");
        }

        listing.setName(request.getName());
        listing.setDescription(request.getDescription());
        listing.setQuantityAvailable(request.getQuantityAvailable());
        listing.setUnit(request.getUnit());
        listing.setPrice(request.getPrice());
        listing.setQualityStatus(request.getQualityStatus());
        listing.setHarvestDate(request.getHarvestDate());
        listing.setListingExpiryDate(request.getListingExpiryDate());
        listing.setStatus(request.getStatus());

        return productListingRepository.save(listing);
    }

    public void deleteListing(Long id) {
        ProductListing listing = getListingById(id);
        productImageRepository.deleteByProductListingId(listing.getId());
        orderRequestRepository.deleteByProductListingId(listing.getId());
        productListingRepository.delete(listing);
    }

    public ProductImage addImage(Long listingId, AddProductImageRequest request) {
        ProductListing listing = getListingById(listingId);

        ProductImage image = ProductImage.builder()
                .productListing(listing)
                .fileName(request.getFileName())
                .filePath(request.getFilePath())
                .build();

        return productImageRepository.save(image);
    }

    public ProductImage uploadImage(Long listingId, MultipartFile file) throws IOException {
        ProductListing listing = getListingById(listingId);

        Map<String, Object> uploadOptions = new HashMap<>();
        uploadOptions.put("folder", "agri-storage-system/product-images");
        uploadOptions.put("resource_type", "image");
        uploadOptions.put("public_id", "listing-" + listingId + "-" + System.currentTimeMillis());

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);
        Object secureUrl = uploadResult.get("secure_url");

        ProductImage image = ProductImage.builder()
                .productListing(listing)
                .fileName(file.getOriginalFilename())
                .filePath(secureUrl != null ? secureUrl.toString() : null)
                .build();

        return productImageRepository.save(image);
    }

    public List<ProductImage> getListingImages(Long listingId) {
        getListingById(listingId);
        return productImageRepository.findByProductListingId(listingId);
    }
}
