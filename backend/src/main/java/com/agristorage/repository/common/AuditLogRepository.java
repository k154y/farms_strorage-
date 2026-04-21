package com.agristorage.repository.common;

import com.agristorage.entity.common.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUserId(Long userId);

    List<AuditLog> findByEntityType(String entityType);

    List<AuditLog> findByEntityTypeAndEntityId(String entityType, Long entityId);

    List<AuditLog> findByAction(String action);
}