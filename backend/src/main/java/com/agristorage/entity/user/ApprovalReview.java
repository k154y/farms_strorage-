package com.agristorage.entity.user;

import com.agristorage.enums.ApprovalDecision;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "approval_reviews")
public class ApprovalReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User reviewedUser;

    @ManyToOne(optional = false)
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalDecision decision;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "reviewed_at", nullable = false)
    private LocalDateTime reviewedAt;

    @PrePersist
    public void prePersist() {
        this.reviewedAt = LocalDateTime.now();
    }
}