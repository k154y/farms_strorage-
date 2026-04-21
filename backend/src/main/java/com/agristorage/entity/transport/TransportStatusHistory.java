package com.agristorage.entity.transport;

import com.agristorage.entity.user.User;
import com.agristorage.enums.TransportRequestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "transport_status_history")
public class TransportStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "transport_request_id", nullable = false)
    private TransportRequest transportRequest;

    @Enumerated(EnumType.STRING)
    @Column(name = "old_status")
    private TransportRequestStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false)
    private TransportRequestStatus newStatus;

    @ManyToOne
    @JoinColumn(name = "changed_by_user_id")
    private User changedByUser;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;

    @PrePersist
    public void prePersist() {
        this.changedAt = LocalDateTime.now();
    }
}