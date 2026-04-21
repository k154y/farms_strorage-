package com.agristorage.controller.user;

import com.agristorage.entity.user.FarmerFarmLocation;
import com.agristorage.entity.user.FarmerProfile;
import com.agristorage.repository.user.FarmerFarmLocationRepository;
import com.agristorage.repository.user.FarmerProfileRepository;
import com.agristorage.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmer/profile")
@RequiredArgsConstructor
public class FarmerProfileController {

    private final FarmerProfileRepository farmerProfileRepository;
    private final FarmerFarmLocationRepository farmLocationRepository;
    private final UserRepository userRepository;

    @PostMapping
    public FarmerProfile createOrUpdateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                               @RequestBody FarmerProfile profile) {
        Long userId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
        profile.setUser(userRepository.findById(userId).orElseThrow());
        return farmerProfileRepository.save(profile);
    }

    @PostMapping("/locations")
    public FarmerFarmLocation addLocation(@AuthenticationPrincipal UserDetails userDetails,
                                          @RequestBody FarmerFarmLocation location) {
        Long userId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
        FarmerProfile profile = farmerProfileRepository.findByUser(userRepository.findById(userId).orElseThrow())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        location.setFarmerProfile(profile);
        return farmLocationRepository.save(location);
    }

    @GetMapping("/locations")
    public List<FarmerFarmLocation> listLocations(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userRepository.findByEmail(userDetails.getUsername()).orElseThrow().getId();
        FarmerProfile profile = farmerProfileRepository.findByUser(userRepository.findById(userId).orElseThrow())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return farmLocationRepository.findByFarmerProfile(profile);
    }
}