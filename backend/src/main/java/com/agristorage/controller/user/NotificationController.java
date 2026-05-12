package com.agristorage.controller.user;

import com.agristorage.entity.user.Notification;
import com.agristorage.service.user.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<Notification> getMyNotifications(@RequestParam(required = false) Long userId,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        Long resolvedUserId = getUserId(userDetails, userId);
        return notificationService.getUserNotifications(resolvedUserId);
    }

    @GetMapping("/my")
    public List<Notification> getMyNotificationsAlias(@RequestParam(required = false) Long userId,
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        Long resolvedUserId = getUserId(userDetails, userId);
        return notificationService.getUserNotifications(resolvedUserId);
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getNotificationsByUser(@PathVariable Long userId) {
        return notificationService.getUserNotifications(userId);
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
    }

    private Long getUserId(UserDetails userDetails, Long fallbackUserId) {
        if (userDetails != null) {
            return notificationService.getUserIdByEmail(userDetails.getUsername());
        }
        if (fallbackUserId != null) {
            return fallbackUserId;
        }
        throw new RuntimeException("User identity is required");
    }
}
