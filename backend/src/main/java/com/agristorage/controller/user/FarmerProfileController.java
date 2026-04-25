package com.agristorage.controller.user;

import com.agristorage.dto.request.UpdateFarmerAccountRequest;
import com.agristorage.dto.response.FarmerFarmLocationResponse;
import com.agristorage.dto.response.FarmerProfileResponse;
import com.agristorage.entity.user.FarmerFarmLocation;
import com.agristorage.entity.user.FarmerProfile;
import com.agristorage.repository.user.FarmerFarmLocationRepository;
import com.agristorage.repository.user.FarmerProfileRepository;
import com.agristorage.repository.user.UserRepository;
import com.agristorage.entity.user.User;
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

    @GetMapping
    public FarmerProfileResponse getMyProfile(@AuthenticationPrincipal UserDetails userDetails,
                                              @RequestParam(required = false) Long userId) {
        User user = resolveUser(userDetails, userId);
        FarmerProfile profile = farmerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return toProfileResponse(profile, user);
    }

    @PutMapping("/account")
    public FarmerProfileResponse updateAccount(@AuthenticationPrincipal UserDetails userDetails,
                                               @RequestBody UpdateFarmerAccountRequest request) {
        User user = resolveUser(userDetails, request.getUserId());
        FarmerProfile profile = farmerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }

        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()) {
            String nextPhoneNumber = request.getPhoneNumber().trim();
            userRepository.findByPhoneNumber(nextPhoneNumber)
                    .filter(existingUser -> !existingUser.getId().equals(user.getId()))
                    .ifPresent(existingUser -> {
                        throw new RuntimeException("Phone number is already in use");
                    });
            user.setPhoneNumber(nextPhoneNumber);
        }

        User savedUser = userRepository.save(user);
        return toProfileResponse(profile, savedUser);
    }

    @PostMapping("/locations")
    public FarmerFarmLocationResponse addLocation(@AuthenticationPrincipal UserDetails userDetails,
                                                  @RequestParam(required = false) Long userId,
                                                  @RequestBody FarmerFarmLocation location) {
        User user = resolveUser(userDetails, userId);
        FarmerProfile profile = farmerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        location.setFarmerProfile(profile);
        FarmerFarmLocation savedLocation = farmLocationRepository.save(location);
        return toLocationResponse(savedLocation);
    }

    @GetMapping("/locations")
    public List<FarmerFarmLocationResponse> listLocations(@AuthenticationPrincipal UserDetails userDetails,
                                                          @RequestParam(required = false) Long userId) {
        User user = resolveUser(userDetails, userId);
        FarmerProfile profile = farmerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return farmLocationRepository.findByFarmerProfile(profile)
                .stream()
                .map(this::toLocationResponse)
                .toList();
    }

    @DeleteMapping("/locations/{locationId}")
    public void deleteLocation(@AuthenticationPrincipal UserDetails userDetails,
                               @RequestParam(required = false) Long userId,
                               @PathVariable Long locationId) {
        User user = resolveUser(userDetails, userId);
        FarmerProfile profile = farmerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        FarmerFarmLocation location = farmLocationRepository.findById(locationId)
                .orElseThrow(() -> new RuntimeException("Farm location not found"));

        if (!location.getFarmerProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("You can only delete your own farm locations");
        }

        farmLocationRepository.delete(location);
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

    private FarmerProfileResponse toProfileResponse(FarmerProfile profile, User user) {
        List<FarmerFarmLocationResponse> locations = farmLocationRepository.findByFarmerProfile(profile)
                .stream()
                .map(this::toLocationResponse)
                .toList();

        return new FarmerProfileResponse(
                profile.getId(),
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getStatus().name(),
                locations
        );
    }

    private FarmerFarmLocationResponse toLocationResponse(FarmerFarmLocation location) {
        return new FarmerFarmLocationResponse(
                location.getId(),
                location.getDistrict(),
                location.getSector(),
                location.getVillage(),
                location.getFarmLocationDescription(),
                location.getLatitude(),
                location.getLongitude()
        );
    }
}
