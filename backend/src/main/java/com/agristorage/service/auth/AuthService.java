package com.agristorage.service.auth;

import com.agristorage.dto.request.LoginRequest;
import com.agristorage.dto.request.RegisterFarmerRequest;
import com.agristorage.dto.request.RegisterManagerRequest;
import com.agristorage.dto.request.RegisterTransporterRequest;
import com.agristorage.dto.response.JwtResponse;
import com.agristorage.dto.response.RegistrationResponse;
import com.agristorage.entity.storage.ProduceCategory;
import com.agristorage.entity.transport.Vehicle;
import com.agristorage.entity.user.*;
import com.agristorage.enums.Role;
import com.agristorage.enums.UserStatus;
import com.agristorage.repository.storage.ProduceCategoryRepository;
import com.agristorage.repository.transport.VehicleRepository;
import com.agristorage.service.common.AuditLogService;
import com.agristorage.service.user.NotificationService;
import com.agristorage.repository.user.*;
import com.agristorage.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final StorageManagerProfileRepository storageManagerProfileRepository;
    private final TransporterProfileRepository transporterProfileRepository;
    private final FarmerFarmLocationRepository farmerFarmLocationRepository;
    private final FarmerPreferredCategoryRepository farmerPreferredCategoryRepository;
    private final ProduceCategoryRepository produceCategoryRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional
    public RegistrationResponse registerFarmer(RegisterFarmerRequest request) {
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.FARMER);
        user.setStatus(UserStatus.ACTIVE);
        user.setEnabled(true);
        userRepository.save(user);

        FarmerProfile profile = new FarmerProfile();
        profile.setUser(user);
        farmerProfileRepository.save(profile);

        if (hasText(request.getDistrict()) && hasText(request.getSector())) {
            FarmerFarmLocation location = FarmerFarmLocation.builder()
                    .farmerProfile(profile)
                    .district(clean(request.getDistrict()))
                    .sector(clean(request.getSector()))
                    .village(clean(request.getVillage()))
                    .farmLocationDescription(clean(request.getFarmLocationDescription()))
                    .latitude(request.getLatitude())
                    .longitude(request.getLongitude())
                    .build();
            farmerFarmLocationRepository.save(location);
        }

        Set<String> preferredProduceTypes = normalizeProduceTypes(request.getPreferredProduceTypes());
        for (String produceType : preferredProduceTypes) {
            ProduceCategory category = produceCategoryRepository.findByNameIgnoreCase(produceType)
                    .orElseGet(() -> produceCategoryRepository.save(ProduceCategory.builder()
                            .name(produceType)
                            .description("Created during farmer registration")
                            .active(true)
                            .build()));

            FarmerPreferredCategory preferredCategory = FarmerPreferredCategory.builder()
                    .farmerProfile(profile)
                    .produceCategory(category)
                    .build();
            farmerPreferredCategoryRepository.save(preferredCategory);
        }

        auditLogService.log(user.getId(), "REGISTERED", "USER", user.getId(), "Farmer account created");
        return new RegistrationResponse("Farmer registered", user.getId(), user.getRole().name(), user.getStatus().name());
    }

    @Transactional
    public RegistrationResponse registerManager(RegisterManagerRequest request) {
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STORAGE_MANAGER);
        user.setStatus(UserStatus.PENDING_APPROVAL);
        user.setEnabled(true);
        userRepository.save(user);

        StorageManagerProfile profile = new StorageManagerProfile();
        profile.setUser(user);
        profile.setBusinessName(request.getBusinessName());
        profile.setRdbRegistrationNumber(request.getRdbRegistrationNumber());
        profile.setFdaLicenseId(request.getFdaLicenseId());
        profile.setRsbCertificationId(request.getRsbCertificationId());
        profile.setOwnerName(request.getOwnerName());
        profile.setBusinessAddress(request.getBusinessAddress());
        profile.setDistrict(request.getDistrict());
        profile.setSector(request.getSector());
        profile.setContactPhone(request.getContactPhone());
        storageManagerProfileRepository.save(profile);

        notificationService.notifyAdmins(
                "New Storage Account",
                user.getFullName() + " created a storage owner account and is awaiting review.",
                "GENERAL"
        );
        auditLogService.log(user.getId(), "REGISTERED", "USER", user.getId(), "Storage manager account created");
        return new RegistrationResponse("Manager pending approval", user.getId(), user.getRole().name(), user.getStatus().name());
    }

    @Transactional
    public RegistrationResponse registerTransporter(RegisterTransporterRequest request) {
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.TRANSPORTER);
        user.setStatus(UserStatus.PENDING_APPROVAL);
        user.setEnabled(true);
        userRepository.save(user);

        TransporterProfile profile = new TransporterProfile();
        profile.setUser(user);
        profile.setBusinessName(request.getBusinessName());
        profile.setDrivingLicenseNumber(request.getDrivingLicenseNumber());
        profile.setRuraCertificateId(request.getRuraCertificateId());
        profile.setCommercialInsurance(request.getCommercialInsurance());
        profile.setOwnershipDetails(request.getOwnershipDetails());
        profile.setDistrict(request.getDistrict());
        profile.setSector(request.getSector());
        profile.setContactPhone(request.getContactPhone());
        transporterProfileRepository.save(profile);

        if (hasText(request.getVehiclePlateNumber()) && request.getVehicleType() != null && request.getVehicleCapacity() != null) {
            Vehicle vehicle = Vehicle.builder()
                    .transporter(user)
                    .plateNumber(clean(request.getVehiclePlateNumber()))
                    .vehicleType(request.getVehicleType())
                    .capacity(request.getVehicleCapacity())
                    .active(true)
                    .build();
            vehicleRepository.save(vehicle);
        }

        notificationService.notifyAdmins(
                "New Transporter Account",
                user.getFullName() + " created a transporter account and is awaiting review.",
                "GENERAL"
        );
        auditLogService.log(user.getId(), "REGISTERED", "USER", user.getId(), "Transporter account created");
        return new RegistrationResponse("Transporter pending approval", user.getId(), user.getRole().name(), user.getStatus().name());
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication.getName());
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new JwtResponse(
                token,
                "Bearer",
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name(),
                user.getStatus().name()
        );
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isBlank();
    }

    private String clean(String value) {
        return hasText(value) ? value.trim() : null;
    }

    private Set<String> normalizeProduceTypes(Iterable<String> produceTypes) {
        Set<String> normalized = new LinkedHashSet<>();

        if (produceTypes == null) {
            return normalized;
        }

        for (String produceType : produceTypes) {
            if (!hasText(produceType)) {
                continue;
            }

            String cleaned = produceType.trim();
            String normalizedValue = cleaned.substring(0, 1).toUpperCase(Locale.ROOT)
                    + cleaned.substring(1).toLowerCase(Locale.ROOT);
            normalized.add(normalizedValue);
        }

        return normalized;
    }
}
