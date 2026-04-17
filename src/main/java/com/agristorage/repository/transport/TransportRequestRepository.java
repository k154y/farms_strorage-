package com.agristorage.repository.transport;

import com.agristorage.entity.transport.TransportRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransportRequestRepository extends JpaRepository<TransportRequest, Long> {
}