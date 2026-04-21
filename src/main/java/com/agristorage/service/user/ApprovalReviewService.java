package com.agristorage.service.user;

import com.agristorage.entity.user.ApprovalReview;
import com.agristorage.entity.user.User;
import com.agristorage.enums.ApprovalDecision;
import com.agristorage.enums.UserStatus;
import com.agristorage.repository.user.ApprovalReviewRepository;
import com.agristorage.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ApprovalReviewService {

    private final UserRepository userRepository;
    private final ApprovalReviewRepository reviewRepository;
    private final NotificationService notificationService;

    @Transactional
    public void approveUser(Long userId, Long adminId, String comment) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(true);
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);

        saveAdminDecision(userId, adminId, ApprovalDecision.APPROVED, comment);

        notificationService.createNotification(userId, "Account Approved", "Your account has been approved.", null);
    }

    @Transactional
    public void rejectUser(Long userId, Long adminId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(false);
        user.setStatus(UserStatus.REJECTED);
        userRepository.save(user);

        saveAdminDecision(userId, adminId, ApprovalDecision.REJECTED, reason);

        notificationService.createNotification(userId, "Account Rejected", "Your account was rejected: " + reason, null);
    }

    // Save admin decision (approve/reject)
    public void saveAdminDecision(Long userId, Long adminId, ApprovalDecision decision, String comment) {
        User user = userRepository.findById(userId).orElseThrow();
        User admin = userRepository.findById(adminId).orElseThrow();

        ApprovalReview review = new ApprovalReview();
        review.setReviewedUser(user);
        review.setAdmin(admin);
        review.setDecision(decision);
        review.setComment(comment);
        review.setReviewedAt(LocalDateTime.now());
        reviewRepository.save(review);
    }

    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }
}