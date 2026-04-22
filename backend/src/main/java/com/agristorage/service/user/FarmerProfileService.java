package com.agristorage.service.user;

import com.agristorage.entity.storage.ProduceCategory;
import com.agristorage.entity.user.FarmerFarmLocation;
import com.agristorage.entity.user.FarmerPreferredCategory;
import com.agristorage.entity.user.FarmerProfile;
import com.agristorage.entity.user.User;
import com.agristorage.repository.storage.ProduceCategoryRepository;
import com.agristorage.repository.user.FarmerFarmLocationRepository;
import com.agristorage.repository.user.FarmerPreferredCategoryRepository;
import com.agristorage.repository.user.FarmerProfileRepository;
import com.agristorage.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FarmerProfileService {

    private final FarmerProfileRepository profileRepository;
    private final FarmerFarmLocationRepository locationRepository;
    private final UserRepository userRepository;
    private final FarmerPreferredCategoryRepository preferredCategoryRepository;
    private final ProduceCategoryRepository produceCategoryRepository;

    // Create farmer profile
    public FarmerProfile createProfile(FarmerProfile profile, Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        profile.setUser(user);
        return profileRepository.save(profile);
    }

    // Add farm location
    public void addFarmLocation(Long farmerId, FarmerFarmLocation location) {
        FarmerProfile profile = profileRepository.findById(farmerId).orElseThrow();
        location.setFarmerProfile(profile);
        locationRepository.save(location);
    }

    // List farm locations
    public List<FarmerFarmLocation> listFarmLocations(Long farmerId) {
        FarmerProfile profile = profileRepository.findById(farmerId).orElseThrow();
        return locationRepository.findByFarmerProfile(profile);
    }

    // Manage preferred categories (replace all)
    @Transactional
    public void managePreferredCategories(Long farmerId, List<Long> categoryIds) {
        FarmerProfile profile = profileRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found"));

        // Remove existing preferences
        preferredCategoryRepository.deleteByFarmerProfile(profile);

        // Add new preferences
        for (Long categoryId : categoryIds) {
            ProduceCategory category = produceCategoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Produce category not found: " + categoryId));
            FarmerPreferredCategory pref = new FarmerPreferredCategory();
            pref.setFarmerProfile(profile);
            pref.setProduceCategory(category);
            preferredCategoryRepository.save(pref);
        }
    }
}