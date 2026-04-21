package com.agristorage.service.user;

import com.agristorage.entity.user.TransporterProfile;
import com.agristorage.entity.user.User;
import com.agristorage.repository.user.TransporterProfileRepository;
import com.agristorage.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransporterProfileService {

    private final TransporterProfileRepository profileRepository;
    private final UserRepository userRepository;

    public TransporterProfile createProfile(TransporterProfile profile, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        profile.setUser(user);
        return profileRepository.save(profile);
    }

    public TransporterProfile updateProfile(TransporterProfile profile) {
        return profileRepository.save(profile);
    }
}