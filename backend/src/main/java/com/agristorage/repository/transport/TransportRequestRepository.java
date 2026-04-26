package com.agristorage.repository.transport;

import com.agristorage.entity.transport.TransportRequest;
import com.agristorage.enums.TransportRequestStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransportRequestRepository extends JpaRepository<TransportRequest, Long> {

    List<TransportRequest> findByBookingId(Long bookingId);

    List<TransportRequest> findByFarmerId(Long farmerId);

    List<TransportRequest> findByTransporterId(Long transporterId);

    List<TransportRequest> findByStatus(TransportRequestStatus status);

    List<TransportRequest> findByStatusAndTransporterIsNull(TransportRequestStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<TransportRequest> findWithLockById(Long id);
}
