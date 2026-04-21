package com.agristorage.controller.user;

import com.agristorage.entity.user.User;
import com.agristorage.enums.Role;
import com.agristorage.enums.UserStatus;
import com.agristorage.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers(@RequestParam(required = false) String role) {
        if (role != null) {
            return userRepository.findByRole(Role.valueOf(role.toUpperCase()));
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
        return userRepository.save(user);
    }

    @PatchMapping("/{id}/enable")
    public User enableUser(@PathVariable Long id, @RequestParam boolean enabled) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(enabled);
        if (enabled && user.getStatus() != UserStatus.ACTIVE) {
            user.setStatus(UserStatus.ACTIVE);
        }
        return userRepository.save(user);
    }
}