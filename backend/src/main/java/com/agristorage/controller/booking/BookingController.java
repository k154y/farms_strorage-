package com.agristorage.controller.booking;

import com.agristorage.dto.request.CreateBookingRequest;
import com.agristorage.dto.request.UpdateBookingStatusRequest;
import com.agristorage.entity.booking.Booking;
import com.agristorage.service.booking.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public Booking createBooking(@Valid @RequestBody CreateBookingRequest request) {
        return bookingService.createBooking(request);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    @PatchMapping("/{id}/status")
    public Booking updateStatus(@PathVariable Long id,
                                @Valid @RequestBody UpdateBookingStatusRequest request) {
        return bookingService.updateStatus(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return "Booking deleted successfully";
    }
}