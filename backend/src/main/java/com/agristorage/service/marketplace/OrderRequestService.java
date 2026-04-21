package com.agristorage.service.marketplace;

import com.agristorage.dto.request.CreateOrderRequestRequest;
import com.agristorage.dto.request.UpdateOrderRequestStatusRequest;
import com.agristorage.entity.marketplace.OrderRequest;
import com.agristorage.entity.marketplace.ProductListing;
import com.agristorage.enums.ListingStatus;
import com.agristorage.enums.OrderRequestStatus;
import com.agristorage.repository.marketplace.OrderRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderRequestService {

    private final OrderRequestRepository orderRequestRepository;
    private final ProductListingService productListingService;

    public OrderRequest createOrderRequest(CreateOrderRequestRequest request) {
        ProductListing listing = productListingService.getListingById(request.getProductListingId());

        if (listing.getStatus() != ListingStatus.ACTIVE) {
            throw new RuntimeException("Order request can only be created for active listings");
        }

        if (request.getRequestedQuantity() > listing.getQuantityAvailable()) {
            throw new RuntimeException("Requested quantity cannot exceed available quantity");
        }

        OrderRequest orderRequest = OrderRequest.builder()
                .productListing(listing)
                .buyerName(request.getBuyerName())
                .buyerPhone(request.getBuyerPhone())
                .buyerEmail(request.getBuyerEmail())
                .requestedQuantity(request.getRequestedQuantity())
                .message(request.getMessage())
                .deliveryLocation(request.getDeliveryLocation())
                .status(OrderRequestStatus.PENDING)
                .build();

        return orderRequestRepository.save(orderRequest);
    }

    public List<OrderRequest> getAllOrderRequests() {
        return orderRequestRepository.findAll();
    }

    public OrderRequest getOrderRequestById(Long id) {
        return orderRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order request not found with id: " + id));
    }

    public List<OrderRequest> getByListingId(Long listingId) {
        return orderRequestRepository.findByProductListingId(listingId);
    }

    public OrderRequest updateStatus(Long orderRequestId, UpdateOrderRequestStatusRequest request) {
        OrderRequest orderRequest = getOrderRequestById(orderRequestId);

        OrderRequestStatus oldStatus = orderRequest.getStatus();
        OrderRequestStatus newStatus = request.getStatus();

        validateStatusTransition(oldStatus, newStatus);

        orderRequest.setStatus(newStatus);
        return orderRequestRepository.save(orderRequest);
    }

    public void deleteOrderRequest(Long id) {
        OrderRequest orderRequest = getOrderRequestById(id);
        orderRequestRepository.delete(orderRequest);
    }

    private void validateStatusTransition(OrderRequestStatus oldStatus, OrderRequestStatus newStatus) {
        if (oldStatus == newStatus) {
            throw new RuntimeException("Order request is already in status: " + newStatus);
        }

        switch (oldStatus) {
            case PENDING -> {
                if (newStatus != OrderRequestStatus.VIEWED &&
                        newStatus != OrderRequestStatus.ACCEPTED &&
                        newStatus != OrderRequestStatus.REJECTED) {
                    throw new RuntimeException("Invalid status transition from PENDING to " + newStatus);
                }
            }
            case VIEWED -> {
                if (newStatus != OrderRequestStatus.CONTACTED &&
                        newStatus != OrderRequestStatus.ACCEPTED &&
                        newStatus != OrderRequestStatus.REJECTED) {
                    throw new RuntimeException("Invalid status transition from VIEWED to " + newStatus);
                }
            }
            case CONTACTED -> {
                if (newStatus != OrderRequestStatus.ACCEPTED &&
                        newStatus != OrderRequestStatus.REJECTED) {
                    throw new RuntimeException("Invalid status transition from CONTACTED to " + newStatus);
                }
            }
            case ACCEPTED, REJECTED -> {
                if (newStatus != OrderRequestStatus.CLOSED) {
                    throw new RuntimeException("Invalid status transition from " + oldStatus + " to " + newStatus);
                }
            }
            case CLOSED -> throw new RuntimeException("No further status changes allowed from CLOSED");
        }
    }
}