package com.agristorage.repository.booking;

import com.agristorage.entity.booking.BookingStatusHistory;
import com.agristorage.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingStatusHistoryRepository extends JpaRepository<BookingStatusHistory, Long> {

    List<BookingStatusHistory> findByBookingId(Long bookingId);

    List<BookingStatusHistory> findByChangedByUserId(Long changedByUserId);

    List<BookingStatusHistory> findByNewStatus(BookingStatus newStatus);
}