package com.agristorage.controller.user;

import com.agristorage.entity.user.StorageManagerProfile;
import com.agristorage.repository.user.StorageManagerProfileRepository;
import com.agristorage.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager/profile")
@RequiredArgsConstructor
public class StorageManagerProfileController {

    private final StorageManagerProfileRepository profileRepository;
    private final UserRepository userRepository;

    @PostMapping
    public StorageManagerProfile createOrUpdateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                       @RequestParam(required = false) Long userId,
                                                       @RequestBody StorageManagerProfile profile) {
        Long resolvedUserId = userDetails != null
                ? userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId()
                : userId;
        profile.setUser(userRepository.findById(resolvedUserId).orElseThrow());
        return profileRepository.save(profile);
    }
}
