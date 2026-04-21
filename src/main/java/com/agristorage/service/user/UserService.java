package com.agristorage.service.user;

import com.agristorage.entity.user.User;
import com.agristorage.enums.UserStatus;
import com.agristorage.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User getUser(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long id, User updatedUser) {
        User user = getUser(id);
        user.setFullName(updatedUser.getFullName());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        return userRepository.save(user);
    }

    public User changeStatus(Long id, UserStatus status) {
        User user = getUser(id);
        user.setStatus(status);
        if (status == UserStatus.ACTIVE) {
            user.setEnabled(true);
        } else if (status == UserStatus.SUSPENDED || status == UserStatus.REJECTED) {
            user.setEnabled(false);
        }
        return userRepository.save(user);
    }

    public User enableUser(Long id, boolean enabled) {
        User user = getUser(id);
        user.setEnabled(enabled);
        if (enabled && user.getStatus() != UserStatus.ACTIVE) {
            user.setStatus(UserStatus.ACTIVE);
        }
        return userRepository.save(user);
    }

    public User disableUser(Long id) {
        User user = getUser(id);
        user.setEnabled(false);
        user.setStatus(UserStatus.SUSPENDED);
        return userRepository.save(user);
    }
}