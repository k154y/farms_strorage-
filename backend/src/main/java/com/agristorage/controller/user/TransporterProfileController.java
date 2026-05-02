package com.agristorage.controller.user;

import com.agristorage.dto.request.UpdateTransporterProfileRequest;
import com.agristorage.dto.response.TransporterProfileResponse;
import com.agristorage.entity.user.TransporterProfile;
import com.agristorage.entity.user.User;
import com.agristorage.exception.ConflictException;
import com.agristorage.repository.user.TransporterProfileRepository;
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
@RequestMapping("/api/transporter/profile")
@RequiredArgsConstructor
public class TransporterProfileController {

    private final TransporterProfileRepository profileRepository;
    private final UserRepository userRepository;

    @GetMapping
    public TransporterProfileResponse getMyProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                   @RequestParam(required = false) Long userId) {
        User user = resolveUser(userDetails, userId);
        TransporterProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return toResponse(profile, user);
    }

    @PutMapping("/account")
    public TransporterProfileResponse updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                    @RequestBody UpdateTransporterProfileRequest request) {
        User user = resolveUser(userDetails, request.getUserId());
        TransporterProfile profile = profileRepository.findByUser(user)
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
        profile.setDrivingLicenseNumber(clean(request.getDrivingLicenseNumber()));
        profile.setDistrict(clean(request.getDistrict()));
        profile.setSector(clean(request.getSector()));
        profile.setContactPhone(clean(request.getContactPhone()));
        profile.setRuraCertificateId(clean(request.getRuraCertificateId()));
        profile.setCommercialInsurance(clean(request.getCommercialInsurance()));
        profile.setOwnershipDetails(clean(request.getOwnershipDetails()));

        User savedUser = userRepository.save(user);
        TransporterProfile savedProfile = profileRepository.save(profile);
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

    private TransporterProfileResponse toResponse(TransporterProfile profile, User user) {
        return new TransporterProfileResponse(
                profile.getId(),
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getStatus().name(),
                profile.getBusinessName(),
                profile.getDrivingLicenseNumber(),
                profile.getDistrict(),
                profile.getSector(),
                profile.getContactPhone(),
                profile.getRuraCertificateId(),
                profile.getCommercialInsurance(),
                profile.getOwnershipDetails(),
                isProfileComplete(profile)
        );
    }

    private boolean isProfileComplete(TransporterProfile profile) {
        return hasText(profile.getBusinessName())
                && hasText(profile.getDrivingLicenseNumber())
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
