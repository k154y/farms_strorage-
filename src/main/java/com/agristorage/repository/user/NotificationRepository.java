package com.agristorage.repository.user;

import com.agristorage.entity.user.Notification;
import com.agristorage.entity.user.User;
import com.agristorage.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUser(User user);

    List<Notification> findByUserId(Long userId);

    List<Notification> findByUserIdAndIsRead(Long userId, boolean isRead);

    List<Notification> findByType(NotificationType type);
}