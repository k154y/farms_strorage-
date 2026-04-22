package com.agristorage.repository.user;

import com.agristorage.entity.user.ApprovalReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApprovalReviewRepository extends JpaRepository<ApprovalReview, Long> {

    List<ApprovalReview> findByReviewedUserId(Long userId);

    List<ApprovalReview> findByAdminId(Long adminId);
}