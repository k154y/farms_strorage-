package com.agristorage.service.booking;

import com.agristorage.dto.request.CreateBookingRequest;
import com.agristorage.dto.request.UpdateBookingStatusRequest;
import com.agristorage.entity.booking.Booking;
import com.agristorage.entity.booking.BookingStatusHistory;
import com.agristorage.entity.storage.ColdRoom;
import com.agristorage.entity.storage.ProduceCategory;
import com.agristorage.entity.storage.StorageFacility;
import com.agristorage.entity.user.User;
import com.agristorage.enums.BookingStatus;
import com.agristorage.enums.Role;
import com.agristorage.repository.booking.BookingRepository;
import com.agristorage.repository.booking.BookingStatusHistoryRepository;
import com.agristorage.repository.storage.ColdRoomRepository;
import com.agristorage.repository.storage.ProduceCategoryRepository;
import com.agristorage.repository.storage.StorageFacilityRepository;
import com.agristorage.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingStatusHistoryRepository historyRepository;

    private final UserRepository userRepository;
    private final StorageFacilityRepository facilityRepository;
    private final ColdRoomRepository coldRoomRepository;
    private final ProduceCategoryRepository categoryRepository;

    // CREATE BOOKING
    public Booking createBooking(CreateBookingRequest request) {

        User farmer = userRepository.findById(request.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        if (farmer.getRole() != Role.FARMER) {
            throw new RuntimeException("User is not a farmer");
        }

        StorageFacility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        ColdRoom coldRoom = coldRoomRepository.findById(request.getColdRoomId())
                .orElseThrow(() -> new RuntimeException("Cold room not found"));

        if (!coldRoom.getFacility().getId().equals(facility.getId())) {
            throw new RuntimeException("Cold room does not belong to this facility");
        }

        ProduceCategory category = categoryRepository.findById(request.getProduceCategoryId())
                .orElseThrow(() -> new RuntimeException("Produce category not found"));

        if (request.getQuantity() > coldRoom.getAvailableCapacity()) {
            throw new RuntimeException("Not enough available capacity");
        }

        Booking booking = Booking.builder()
                .farmer(farmer)
                .facility(facility)
                .coldRoom(coldRoom)
                .produceCategory(category)
                .quantity(request.getQuantity())
                .entryDate(request.getEntryDate())
                .expectedDurationDays(request.getExpectedDurationDays())
                .priceAtBooking(coldRoom.getPricePerUnit())
                .totalEstimatedCost(request.getQuantity() * coldRoom.getPricePerUnit())
                .status(BookingStatus.PENDING)
                .build();

        return bookingRepository.save(booking);
    }

    // GET ALL
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // GET BY ID
    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    // UPDATE STATUS
    public Booking updateStatus(Long bookingId, UpdateBookingStatusRequest request) {

        Booking booking = getBookingById(bookingId);

        BookingStatus oldStatus = booking.getStatus();
        BookingStatus newStatus = request.getStatus();

        booking.setStatus(newStatus);

        // capacity logic
        if (newStatus == BookingStatus.APPROVED) {
            ColdRoom room = booking.getColdRoom();
            room.setAvailableCapacity(room.getAvailableCapacity() - booking.getQuantity());
        }

        // history
        BookingStatusHistory history = BookingStatusHistory.builder()
                .booking(booking)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .comment(request.getComment())
                .build();

        historyRepository.save(history);

        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        Booking booking = getBookingById(id);
        bookingRepository.delete(booking);
    }
}