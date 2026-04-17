package com.agristorage.repository.transport;

import com.agristorage.entity.transport.TransportStatusHistory;
import com.agristorage.enums.TransportRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransportStatusHistoryRepository extends JpaRepository<TransportStatusHistory, Long> {

    List<TransportStatusHistory> findByTransportRequestId(Long transportRequestId);

    List<TransportStatusHistory> findByChangedByUserId(Long changedByUserId);

    List<TransportStatusHistory> findByNewStatus(TransportRequestStatus newStatus);
}