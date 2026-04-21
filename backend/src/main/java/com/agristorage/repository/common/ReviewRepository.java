package com.agristorage.repository.common;

import com.agristorage.entity.common.Review;
import com.agristorage.enums.ReviewTargetType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByReviewerId(Long reviewerId);

    List<Review> findByTargetType(ReviewTargetType targetType);

    List<Review> findByTargetTypeAndTargetId(ReviewTargetType targetType, Long targetId);
}