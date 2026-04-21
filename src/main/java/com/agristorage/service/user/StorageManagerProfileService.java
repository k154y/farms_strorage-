package com.agristorage.service.user;

import com.agristorage.entity.user.StorageManagerProfile;
import com.agristorage.entity.user.User;
import com.agristorage.repository.user.StorageManagerProfileRepository;
import com.agristorage.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StorageManagerProfileService {

    private final StorageManagerProfileRepository profileRepository;
    private final UserRepository userRepository;

    public StorageManagerProfile createProfile(StorageManagerProfile profile, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        profile.setUser(user);
        return profileRepository.save(profile);
    }

    public StorageManagerProfile updateProfile(StorageManagerProfile profile) {
        return profileRepository.save(profile);
    }
}