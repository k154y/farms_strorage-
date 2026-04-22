package com.agristorage.service.user;

import com.agristorage.dto.request.ApprovalRequest;
import com.agristorage.entity.user.User;
import com.agristorage.enums.Role;
import com.agristorage.enums.UserStatus;
import com.agristorage.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ApprovalReviewService approvalReviewService;

    public List<User> getPendingUsers() {
        return userRepository.findByStatus(UserStatus.PENDING_APPROVAL);
    }

    public List<User> getAllUsers(String role) {
        if (role != null) {
            return userRepository.findByRole(Role.valueOf(role.toUpperCase()));
        }
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public void approveUser(Long userId, Long adminId, String comment) {
        approvalReviewService.approveUser(userId, adminId, comment);
    }

    @Transactional
    public void rejectUser(Long userId, Long adminId, String reason) {
        approvalReviewService.rejectUser(userId, adminId, reason);
    }

    @Transactional
    public User updateUserStatus(Long userId, UserStatus status) {
        User user = getUserById(userId);
        user.setStatus(status);
        if (status == UserStatus.ACTIVE) {
            user.setEnabled(true);
        } else if (status == UserStatus.SUSPENDED || status == UserStatus.REJECTED) {
            user.setEnabled(false);
        }
        return userRepository.save(user);
    }

    @Transactional
    public User enableUser(Long userId, boolean enabled) {
        User user = getUserById(userId);
        user.setEnabled(enabled);
        if (enabled && user.getStatus() != UserStatus.ACTIVE) {
            user.setStatus(UserStatus.ACTIVE);
        }
        return userRepository.save(user);
    }
}