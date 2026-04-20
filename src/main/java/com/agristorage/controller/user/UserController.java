package com.agristorage.controller.user;

import com.agristorage.dto.response.MessageResponse;
import com.agristorage.entity.user.*;
import com.agristorage.enums.Role;
import com.agristorage.enums.UserStatus;
import com.agristorage.repository.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final StorageManagerProfileRepository storageManagerProfileRepository;
    private final TransporterProfileRepository transporterProfileRepository;

    @GetMapping("/me")
    public User getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PutMapping("/me")
    public User updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                              @RequestBody User updatedUser) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setFullName(updatedUser.getFullName());
        user.setPhoneNumber(updatedUser.getPhoneNumber());
        return userRepository.save(user);
    }

    @DeleteMapping("/me")
    public MessageResponse deactivateAccount(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(false);
        user.setStatus(UserStatus.SUSPENDED);
        userRepository.save(user);
        return new MessageResponse("Account deactivated");
    }

    @GetMapping("/me/profile")
    public Object getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return switch (user.getRole()) {
            case FARMER -> farmerProfileRepository.findByUser(user).orElseThrow();
            case STORAGE_MANAGER -> storageManagerProfileRepository.findByUser(user).orElseThrow();
            case TRANSPORTER -> transporterProfileRepository.findByUser(user).orElseThrow();
            case ADMIN -> new MessageResponse("Admin has no extra profile");
        };
    }

    @PutMapping("/me/profile")
    public Object updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                @RequestBody Object profileUpdate) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return switch (user.getRole()) {
            case FARMER -> {
                FarmerProfile fp = farmerProfileRepository.findByUser(user).orElseThrow();
                yield farmerProfileRepository.save(fp);
            }
            case STORAGE_MANAGER -> {
                StorageManagerProfile smp = storageManagerProfileRepository.findByUser(user).orElseThrow();
                yield storageManagerProfileRepository.save(smp);
            }
            case TRANSPORTER -> {
                TransporterProfile tp = transporterProfileRepository.findByUser(user).orElseThrow();
                yield transporterProfileRepository.save(tp);
            }
            default -> new MessageResponse("No profile to update");
        };
    }
}