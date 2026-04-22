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
    public List<Notification> getMyNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return notificationService.getUserNotifications(userId);
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }

    private Long getUserId(UserDetails userDetails) {
        return notificationService.getUserIdByEmail(userDetails.getUsername());
    }
}