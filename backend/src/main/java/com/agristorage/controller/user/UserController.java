package com.agristorage.controller.user;

import com.agristorage.entity.user.User;
import com.agristorage.enums.Role;
import com.agristorage.enums.UserStatus;
import com.agristorage.repository.user.UserRepository;
import com.agristorage.service.common.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @GetMapping
    public List<User> getAllUsers(@RequestParam(required = false) String role,
                                  @RequestParam(required = false) String status) {
        if (role != null && status != null) {
            Role parsedRole = Role.valueOf(role.toUpperCase());
            UserStatus parsedStatus = UserStatus.valueOf(status.toUpperCase());
            return userRepository.findAll().stream()
                    .filter(user -> user.getRole() == parsedRole && user.getStatus() == parsedStatus)
                    .toList();
        }
        if (role != null) {
            return userRepository.findByRole(Role.valueOf(role.toUpperCase()));
        }
        if (status != null) {
            return userRepository.findByStatus(UserStatus.valueOf(status.toUpperCase()));
        }
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PatchMapping("/{id}/status")
    public User updateUserStatus(@PathVariable Long id, @RequestBody UserStatus status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        if (status == UserStatus.ACTIVE) {
            user.setEnabled(true);
        } else if (status == UserStatus.SUSPENDED || status == UserStatus.REJECTED) {
            user.setEnabled(false);
        }
        User saved = userRepository.save(user);
        auditLogService.log(saved.getId(), "USER_STATUS_UPDATED", "USER", saved.getId(), "Status changed to " + status.name());
        return saved;
    }

    @PatchMapping("/{id}/enable")
    public User enableUser(@PathVariable Long id, @RequestParam boolean enabled) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(enabled);
        if (enabled && user.getStatus() != UserStatus.ACTIVE) {
            user.setStatus(UserStatus.ACTIVE);
        }
        User saved = userRepository.save(user);
        auditLogService.log(saved.getId(), "USER_ENABLED_UPDATED", "USER", saved.getId(), "Enabled set to " + enabled);
        return saved;
    }
}
