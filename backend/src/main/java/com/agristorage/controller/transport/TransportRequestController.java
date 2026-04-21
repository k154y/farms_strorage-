package com.agristorage.controller.transport;

import com.agristorage.dto.request.AssignTransportRequest;
import com.agristorage.dto.request.CreateTransportRequestRequest;
import com.agristorage.dto.request.UpdateTransportStatusRequest;
import com.agristorage.entity.transport.TransportRequest;
import com.agristorage.entity.transport.TransportStatusHistory;
import com.agristorage.service.transport.TransportRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transport/requests")
@RequiredArgsConstructor
public class TransportRequestController {

    private final TransportRequestService transportRequestService;

    @PostMapping
    public TransportRequest createTransportRequest(@Valid @RequestBody CreateTransportRequestRequest request) {
        return transportRequestService.createTransportRequest(request);
    }

    @GetMapping
    public List<TransportRequest> getAllTransportRequests() {
        return transportRequestService.getAllTransportRequests();
    }

    @GetMapping("/{id}")
    public TransportRequest getTransportRequestById(@PathVariable Long id) {
        return transportRequestService.getTransportRequestById(id);
    }

    @GetMapping("/booking/{bookingId}")
    public List<TransportRequest> getByBookingId(@PathVariable Long bookingId) {
        return transportRequestService.getByBookingId(bookingId);
    }

    @GetMapping("/farmer/{farmerId}")
    public List<TransportRequest> getByFarmerId(@PathVariable Long farmerId) {
        return transportRequestService.getByFarmerId(farmerId);
    }

    @GetMapping("/transporter/{transporterId}")
    public List<TransportRequest> getByTransporterId(@PathVariable Long transporterId) {
        return transportRequestService.getByTransporterId(transporterId);
    }

    @PatchMapping("/{id}/assign")
    public TransportRequest assignTransportRequest(@PathVariable Long id,
                                                   @Valid @RequestBody AssignTransportRequest request) {
        return transportRequestService.assignTransportRequest(id, request);
    }

    @PatchMapping("/{id}/status")
    public TransportRequest updateStatus(@PathVariable Long id,
                                         @Valid @RequestBody UpdateTransportStatusRequest request) {
        return transportRequestService.updateStatus(id, request);
    }

    @GetMapping("/{id}/history")
    public List<TransportStatusHistory> getHistory(@PathVariable Long id) {
        return transportRequestService.getHistory(id);
    }

    @DeleteMapping("/{id}")
    public String deleteTransportRequest(@PathVariable Long id) {
        transportRequestService.deleteTransportRequest(id);
        return "Transport request deleted successfully";
    }
}