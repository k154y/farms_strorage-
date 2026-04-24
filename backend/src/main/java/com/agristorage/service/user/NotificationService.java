package com.agristorage.service.user;

import com.agristorage.entity.user.Notification;
import com.agristorage.entity.user.User;
import com.agristorage.enums.NotificationType;
import com.agristorage.enums.Role;
import com.agristorage.repository.user.NotificationRepository;
import com.agristorage.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // Create notification
    public void createNotification(Long userId, String title, String message, String type) {
        Notification notification = new Notification();
        notification.setUser(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")));
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(resolveNotificationType(type));
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    public void notifyAdmins(String title, String message, String type) {
        for (User admin : userRepository.findByRole(Role.ADMIN)) {
            createNotification(admin.getId(), title, message, type);
        }
    }

    // List notifications by user
    public List<Notification> listNotificationsByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return listNotificationsByUser(userId);
    }

    // Mark as read
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    // Helper to get userId from email
    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }

    private NotificationType resolveNotificationType(String type) {
        if (type == null || type.isBlank()) {
            return NotificationType.GENERAL;
        }

        try {
            return NotificationType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return NotificationType.GENERAL;
        }
    }
}
