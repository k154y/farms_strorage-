package com.agristorage.controller.marketplace;

import com.agristorage.dto.request.CreateOrderRequestRequest;
import com.agristorage.dto.request.UpdateOrderRequestStatusRequest;
import com.agristorage.entity.marketplace.OrderRequest;
import com.agristorage.service.marketplace.OrderRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marketplace/orders")
@RequiredArgsConstructor
public class OrderRequestController {

    private final OrderRequestService orderRequestService;

    @PostMapping
    public OrderRequest createOrderRequest(@Valid @RequestBody CreateOrderRequestRequest request) {
        return orderRequestService.createOrderRequest(request);
    }

    @GetMapping
    public List<OrderRequest> getAllOrderRequests() {
        return orderRequestService.getAllOrderRequests();
    }

    @GetMapping("/{id}")
    public OrderRequest getOrderRequestById(@PathVariable Long id) {
        return orderRequestService.getOrderRequestById(id);
    }

    @GetMapping("/listing/{listingId}")
    public List<OrderRequest> getByListingId(@PathVariable Long listingId) {
        return orderRequestService.getByListingId(listingId);
    }

    @GetMapping("/farmer/{farmerId}")
    public List<OrderRequest> getByFarmerId(@PathVariable Long farmerId) {
        return orderRequestService.getByFarmerId(farmerId);
    }

    @PatchMapping("/{id}/status")
    public OrderRequest updateStatus(@PathVariable Long id,
                                     @Valid @RequestBody UpdateOrderRequestStatusRequest request) {
        return orderRequestService.updateStatus(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteOrderRequest(@PathVariable Long id) {
        orderRequestService.deleteOrderRequest(id);
        return "Order request deleted successfully";
    }
}
