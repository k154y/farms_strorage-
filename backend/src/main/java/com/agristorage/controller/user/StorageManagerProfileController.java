package com.agristorage.controller.user;

import com.agristorage.dto.request.UpdateStorageManagerProfileRequest;
import com.agristorage.dto.response.StorageManagerProfileResponse;
import com.agristorage.entity.user.StorageManagerProfile;
import com.agristorage.entity.user.User;
import com.agristorage.exception.ConflictException;
import com.agristorage.repository.user.StorageManagerProfileRepository;
import com.agristorage.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/manager/profile")
@RequiredArgsConstructor
public class StorageManagerProfileController {

    private final StorageManagerProfileRepository profileRepository;
    private final UserRepository userRepository;

    @GetMapping
    public StorageManagerProfileResponse getMyProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                      @RequestParam(required = false) Long userId) {
        User user = resolveUser(userDetails, userId);
        StorageManagerProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return toResponse(profile, user);
    }

    @PutMapping("/account")
    public StorageManagerProfileResponse updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                       @RequestBody UpdateStorageManagerProfileRequest request) {
        User user = resolveUser(userDetails, request.getUserId());
        StorageManagerProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }

        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()) {
            String nextPhoneNumber = request.getPhoneNumber().trim();
            userRepository.findByPhoneNumber(nextPhoneNumber)
                    .filter(existingUser -> !existingUser.getId().equals(user.getId()))
                    .ifPresent(existingUser -> {
                        throw new ConflictException("Phone number is already in use");
                    });
            user.setPhoneNumber(nextPhoneNumber);
        }

        profile.setBusinessName(clean(request.getBusinessName()));
        profile.setOwnerName(clean(request.getOwnerName()));
        profile.setDistrict(clean(request.getDistrict()));
        profile.setSector(clean(request.getSector()));
        profile.setContactPhone(clean(request.getContactPhone()));
        profile.setBusinessAddress(clean(request.getBusinessAddress()));
        profile.setRdbRegistrationNumber(clean(request.getRdbRegistrationNumber()));
        profile.setFdaLicenseId(clean(request.getFdaLicenseId()));
        profile.setRsbCertificationId(clean(request.getRsbCertificationId()));

        User savedUser = userRepository.save(user);
        StorageManagerProfile savedProfile = profileRepository.save(profile);
        return toResponse(savedProfile, savedUser);
    }

    private User resolveUser(UserDetails userDetails, Long fallbackUserId) {
        if (userDetails != null) {
            return userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        if (fallbackUserId != null) {
            return userRepository.findById(fallbackUserId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        throw new RuntimeException("User identity is required");
    }

    private StorageManagerProfileResponse toResponse(StorageManagerProfile profile, User user) {
        return new StorageManagerProfileResponse(
                profile.getId(),
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getStatus().name(),
                profile.getBusinessName(),
                profile.getOwnerName(),
                profile.getDistrict(),
                profile.getSector(),
                profile.getContactPhone(),
                profile.getBusinessAddress(),
                profile.getRdbRegistrationNumber(),
                profile.getFdaLicenseId(),
                profile.getRsbCertificationId(),
                isProfileComplete(profile)
        );
    }

    private boolean isProfileComplete(StorageManagerProfile profile) {
        return hasText(profile.getBusinessName())
                && hasText(profile.getOwnerName())
                && hasText(profile.getDistrict())
                && hasText(profile.getSector())
                && hasText(profile.getContactPhone());
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private String clean(String value) {
        return hasText(value) ? value.trim() : null;
    }
}
