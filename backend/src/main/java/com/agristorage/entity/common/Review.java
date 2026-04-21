package com.agristorage.entity.common;

import com.agristorage.entity.user.User;
import com.agristorage.enums.ReviewTargetType;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "reviews")
public class Review extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private ReviewTargetType targetType;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;
}