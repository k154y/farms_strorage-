package com.agristorage.service.auth;

import com.agristorage.dto.request.ForgotPasswordRequest;
import com.agristorage.dto.request.GoogleLoginRequest;
import com.agristorage.dto.request.GoogleRegisterRequest;
import com.agristorage.dto.request.LoginRequest;
import com.agristorage.dto.request.ResendVerificationEmailRequest;
import com.agristorage.dto.request.RegisterFarmerRequest;
import com.agristorage.dto.request.RegisterManagerRequest;
import com.agristorage.dto.request.RegisterTransporterRequest;
import com.agristorage.dto.request.ResetPasswordRequest;
import com.agristorage.dto.response.GoogleTokenInfoResponse;
import com.agristorage.dto.response.JwtResponse;
import com.agristorage.dto.response.MessageResponse;
import com.agristorage.dto.response.RegistrationResponse;
import com.agristorage.entity.storage.ProduceCategory;
import com.agristorage.entity.transport.Vehicle;
import com.agristorage.entity.user.EmailVerificationToken;
import com.agristorage.entity.user.FarmerFarmLocation;
import com.agristorage.entity.user.FarmerPreferredCategory;
import com.agristorage.entity.user.FarmerProfile;
import com.agristorage.entity.user.PasswordResetToken;
import com.agristorage.entity.user.StorageManagerProfile;
import com.agristorage.entity.user.TransporterProfile;
import com.agristorage.entity.user.User;
import com.agristorage.enums.Role;
import com.agristorage.enums.UserStatus;
import com.agristorage.exception.BadRequestException;
import com.agristorage.exception.ConflictException;
import com.agristorage.repository.storage.ProduceCategoryRepository;
import com.agristorage.repository.transport.VehicleRepository;
import com.agristorage.repository.user.EmailVerificationTokenRepository;
import com.agristorage.repository.user.FarmerFarmLocationRepository;
import com.agristorage.repository.user.FarmerPreferredCategoryRepository;
import com.agristorage.repository.user.FarmerProfileRepository;
import com.agristorage.repository.user.PasswordResetTokenRepository;
import com.agristorage.repository.user.StorageManagerProfileRepository;
import com.agristorage.repository.user.TransporterProfileRepository;
import com.agristorage.repository.user.UserRepository;
import com.agristorage.security.JwtTokenProvider;
import com.agristorage.service.common.AuditLogService;
import com.agristorage.service.user.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String GOOGLE_TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo";

    private final UserRepository userRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final StorageManagerProfileRepository storageManagerProfileRepository;
    private final TransporterProfileRepository transporterProfileRepository;
    private final FarmerFarmLocationRepository farmerFarmLocationRepository;
    private final FarmerPreferredCategoryRepository farmerPreferredCategoryRepository;
    private final ProduceCategoryRepository produceCategoryRepository;
    private final VehicleRepository vehicleRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;
    private final AuthMailService authMailService;
    private final RestClient restClient = RestClient.create();

    @Value("${app.google.client-id:}")
    private String googleClientId;

    @Value("${app.auth.verification-expiration-minutes:1440}")
    private long verificationExpirationMinutes;

    @Value("${app.auth.reset-expiration-minutes:30}")
    private long resetExpirationMinutes;

    @Transactional
    public RegistrationResponse registerFarmer(RegisterFarmerRequest request) {
        ensureEmailAvailable(request.getEmail());
        ensurePhoneAvailable(request.getPhoneNumber());

        User user = new User();
        user.setFullName(clean(request.getFullName()));
        user.setEmail(cleanEmail(request.getEmail()));
        user.setPhoneNumber(clean(request.getPhoneNumber()));
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.FARMER);
        user.setStatus(UserStatus.ACTIVE);
        user.setEnabled(false);
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

        sendVerificationEmail(user);
        auditLogService.log(user.getId(), "REGISTERED", "USER", user.getId(), "Farmer account created");
        return new RegistrationResponse(
                "Farmer registered. Please confirm your email before logging in.",
                user.getId(),
                user.getRole().name(),
                user.getStatus().name()
        );
    }

    @Transactional
    public RegistrationResponse registerManager(RegisterManagerRequest request) {
        ensureEmailAvailable(request.getEmail());
        ensurePhoneAvailable(request.getPhoneNumber());

        User user = new User();
        user.setFullName(clean(request.getFullName()));
        user.setEmail(cleanEmail(request.getEmail()));
        user.setPhoneNumber(clean(request.getPhoneNumber()));
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.STORAGE_MANAGER);
        user.setStatus(UserStatus.PENDING_APPROVAL);
        user.setEnabled(false);
        userRepository.save(user);

        StorageManagerProfile profile = new StorageManagerProfile();
        profile.setUser(user);
        profile.setBusinessName(clean(request.getBusinessName()));
        profile.setRdbRegistrationNumber(clean(request.getRdbRegistrationNumber()));
        profile.setFdaLicenseId(clean(request.getFdaLicenseId()));
        profile.setRsbCertificationId(clean(request.getRsbCertificationId()));
        profile.setOwnerName(clean(request.getOwnerName()));
        profile.setBusinessAddress(clean(request.getBusinessAddress()));
        profile.setDistrict(clean(request.getDistrict()));
        profile.setSector(clean(request.getSector()));
        profile.setContactPhone(clean(request.getContactPhone()));
        storageManagerProfileRepository.save(profile);

        sendVerificationEmail(user);
        notificationService.notifyAdmins(
                "New Storage Account",
                user.getFullName() + " created a storage owner account and is awaiting review.",
                "GENERAL"
        );
        auditLogService.log(user.getId(), "REGISTERED", "USER", user.getId(), "Storage manager account created");
        return new RegistrationResponse(
                "Manager pending approval. Please confirm your email before logging in.",
                user.getId(),
                user.getRole().name(),
                user.getStatus().name()
        );
    }

    @Transactional
    public RegistrationResponse registerTransporter(RegisterTransporterRequest request) {
        ensureEmailAvailable(request.getEmail());
        ensurePhoneAvailable(request.getPhoneNumber());

        User user = new User();
        user.setFullName(clean(request.getFullName()));
        user.setEmail(cleanEmail(request.getEmail()));
        user.setPhoneNumber(clean(request.getPhoneNumber()));
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.TRANSPORTER);
        user.setStatus(UserStatus.PENDING_APPROVAL);
        user.setEnabled(false);
        userRepository.save(user);

        TransporterProfile profile = new TransporterProfile();
        profile.setUser(user);
        profile.setBusinessName(clean(request.getBusinessName()));
        profile.setDrivingLicenseNumber(clean(request.getDrivingLicenseNumber()));
        profile.setRuraCertificateId(clean(request.getRuraCertificateId()));
        profile.setCommercialInsurance(clean(request.getCommercialInsurance()));
        profile.setOwnershipDetails(clean(request.getOwnershipDetails()));
        profile.setDistrict(clean(request.getDistrict()));
        profile.setSector(clean(request.getSector()));
        profile.setContactPhone(clean(request.getContactPhone()));
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

        sendVerificationEmail(user);
        notificationService.notifyAdmins(
                "New Transporter Account",
                user.getFullName() + " created a transporter account and is awaiting review.",
                "GENERAL"
        );
        auditLogService.log(user.getId(), "REGISTERED", "USER", user.getId(), "Transporter account created");
        return new RegistrationResponse(
                "Transporter pending approval. Please confirm your email before logging in.",
                user.getId(),
                user.getRole().name(),
                user.getStatus().name()
        );
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (DisabledException ex) {
            User user = userRepository.findByEmailIgnoreCase(request.getEmail()).orElse(null);
            if (user != null && requiresEmailVerification(user)) {
                throw new BadRequestException("Your account exists, but your email is not confirmed yet. Please use the confirmation link sent to your email.");
            }
            throw new BadRequestException("This account is disabled.");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication.getName());
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return buildJwtResponse(user, token);
    }

    public JwtResponse loginWithGoogle(GoogleLoginRequest request) {
        GoogleTokenInfoResponse tokenInfo = verifyGoogleToken(request.getIdToken());

        User user = userRepository.findByEmailIgnoreCase(tokenInfo.getEmail())
                .orElseThrow(() -> new BadRequestException(
                        "No account was found for this Google email. Please register first, then sign in with Google."
                ));

        if (requiresEmailVerification(user)) {
            throw new BadRequestException("Your account exists, but your email is not confirmed yet. Please use the confirmation link sent to your email.");
        }
        String token = tokenProvider.generateToken(user.getEmail());
        auditLogService.log(user.getId(), "LOGGED_IN_WITH_GOOGLE", "USER", user.getId(), "User signed in with Google");
        return buildJwtResponse(user, token);
    }

    @Transactional
    public MessageResponse registerWithGoogle(GoogleRegisterRequest request) {
        GoogleTokenInfoResponse tokenInfo = verifyGoogleToken(request.getIdToken());
        String email = cleanEmail(tokenInfo.getEmail());

        ensureEmailAvailable(email);
        ensurePhoneAvailable(request.getPhoneNumber());
        validateGoogleRegistration(request);

        User user = new User();
        user.setFullName(clean(request.getFullName()));
        user.setEmail(email);
        user.setPhoneNumber(clean(request.getPhoneNumber()));
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setRole(request.getRole());
        user.setStatus(request.getRole() == Role.FARMER ? UserStatus.ACTIVE : UserStatus.PENDING_APPROVAL);
        user.setEnabled(false);
        userRepository.save(user);

        switch (request.getRole()) {
            case FARMER -> createFarmerProfile(user, request);
            case STORAGE_MANAGER -> createStorageManagerProfile(user, request);
            case TRANSPORTER -> createTransporterProfile(user, request);
            default -> throw new BadRequestException("Unsupported role selected for Google registration.");
        }

        auditLogService.log(user.getId(), "REGISTERED_WITH_GOOGLE", "USER", user.getId(),
                request.getRole().name() + " account created with Google");
        sendVerificationEmail(user);
        return new MessageResponse("Account created with Google. Please confirm your email before logging in.");
    }

    @Transactional
    public MessageResponse verifyEmail(String token) {
        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("This email verification link is invalid."));

        if (verificationToken.getUsedAt() != null) {
            throw new BadRequestException("This email verification link has already been used.");
        }

        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("This email verification link has expired.");
        }

        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);

        verificationToken.setUsedAt(LocalDateTime.now());
        emailVerificationTokenRepository.save(verificationToken);

        return new MessageResponse("Your email has been confirmed. You can now log in.");
    }

    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new BadRequestException("No account was found with that email address."));

        if (requiresEmailVerification(user)) {
            throw new BadRequestException("Please verify your email before resetting your password.");
        }

        passwordResetTokenRepository.deleteByUser(user);

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiresAt(LocalDateTime.now().plusMinutes(resetExpirationMinutes));
        passwordResetTokenRepository.save(token);

        sendPasswordResetEmail(user, token.getToken());
        return new MessageResponse("A password reset email has been sent.");
    }

    @Transactional
    public MessageResponse resendVerificationEmail(ResendVerificationEmailRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new BadRequestException("No account was found with that email address."));

        if (!requiresEmailVerification(user)) {
            throw new BadRequestException("This account is already confirmed or not eligible for email confirmation.");
        }

        sendVerificationEmail(user);
        return new MessageResponse("A new confirmation email has been sent.");
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("This password reset link is invalid."));

        if (token.getUsedAt() != null) {
            throw new BadRequestException("This password reset link has already been used.");
        }

        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("This password reset link has expired.");
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        token.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(token);

        auditLogService.log(user.getId(), "PASSWORD_RESET", "USER", user.getId(), "User reset password");
        return new MessageResponse("Your password has been reset. You can now log in.");
    }

    private JwtResponse buildJwtResponse(User user, String token) {
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

    private GoogleTokenInfoResponse verifyGoogleToken(String idToken) {
        if (!hasText(googleClientId)) {
            throw new BadRequestException("Google sign-in is not configured on the server.");
        }

        GoogleTokenInfoResponse tokenInfo;
        try {
            String encodedIdToken = URLEncoder.encode(idToken, StandardCharsets.UTF_8);
            tokenInfo = restClient.get()
                    .uri(URI.create(GOOGLE_TOKENINFO_URL + "?id_token=" + encodedIdToken))
                    .retrieve()
                    .body(GoogleTokenInfoResponse.class);
        } catch (RestClientException ex) {
            throw new BadRequestException("Google sign-in failed. The Google token could not be verified.");
        }

        if (tokenInfo == null || !hasText(tokenInfo.getEmail())) {
            throw new BadRequestException("Google sign-in failed. The Google account email was not returned.");
        }

        if (!googleClientId.equals(tokenInfo.getAud())) {
            throw new BadRequestException("Google sign-in failed. The Google token audience does not match this app.");
        }

        if (!"true".equalsIgnoreCase(tokenInfo.getEmailVerified())) {
            throw new BadRequestException("Google sign-in requires a verified Google email address.");
        }

        return tokenInfo;
    }

    private void createFarmerProfile(User user, GoogleRegisterRequest request) {
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

        Set<String> preferredProduceTypes = normalizeProduceTypes(
                request.getPreferredProduceTypes() == null ? Collections.emptyList() : request.getPreferredProduceTypes()
        );
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
    }

    private void createStorageManagerProfile(User user, GoogleRegisterRequest request) {
        StorageManagerProfile profile = new StorageManagerProfile();
        profile.setUser(user);
        profile.setBusinessName(clean(request.getBusinessName()));
        profile.setRdbRegistrationNumber(clean(request.getRdbRegistrationNumber()));
        profile.setFdaLicenseId(clean(request.getFdaLicenseId()));
        profile.setRsbCertificationId(clean(request.getRsbCertificationId()));
        profile.setOwnerName(clean(request.getOwnerName()));
        profile.setBusinessAddress(clean(request.getBusinessAddress()));
        profile.setDistrict(clean(request.getDistrict()));
        profile.setSector(clean(request.getSector()));
        profile.setContactPhone(clean(request.getContactPhone()));
        storageManagerProfileRepository.save(profile);

        notificationService.notifyAdmins(
                "New Storage Account",
                user.getFullName() + " created a storage owner account with Google and is awaiting review.",
                "GENERAL"
        );
    }

    private void createTransporterProfile(User user, GoogleRegisterRequest request) {
        TransporterProfile profile = new TransporterProfile();
        profile.setUser(user);
        profile.setBusinessName(clean(request.getBusinessName()));
        profile.setDrivingLicenseNumber(clean(request.getDrivingLicenseNumber()));
        profile.setRuraCertificateId(clean(request.getRuraCertificateId()));
        profile.setCommercialInsurance(clean(request.getCommercialInsurance()));
        profile.setOwnershipDetails(clean(request.getOwnershipDetails()));
        profile.setDistrict(clean(request.getDistrict()));
        profile.setSector(clean(request.getSector()));
        profile.setContactPhone(clean(request.getContactPhone()));
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
                user.getFullName() + " created a transporter account with Google and is awaiting review.",
                "GENERAL"
        );
    }

    private void validateGoogleRegistration(GoogleRegisterRequest request) {
        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Admin accounts cannot be created with Google registration.");
        }

        if (request.getRole() == Role.FARMER) {
            requireText(request.getDistrict(), "District is required.");
            requireText(request.getSector(), "Sector is required.");
            return;
        }

        if (request.getRole() == Role.STORAGE_MANAGER) {
            requireText(request.getBusinessName(), "Business name is required.");
            requireText(request.getOwnerName(), "Owner name is required.");
            requireText(request.getDistrict(), "District is required.");
            requireText(request.getSector(), "Sector is required.");
            requireText(request.getContactPhone(), "Contact phone is required.");
            return;
        }

        if (request.getRole() == Role.TRANSPORTER) {
            requireText(request.getBusinessName(), "Business name is required.");
            requireText(request.getDrivingLicenseNumber(), "Driving license number is required.");
            requireText(request.getDistrict(), "District is required.");
            requireText(request.getSector(), "Sector is required.");
            requireText(request.getContactPhone(), "Contact phone is required.");
        }
    }

    private void requireText(String value, String message) {
        if (!hasText(value)) {
            throw new BadRequestException(message);
        }
    }

    private void ensureEmailAvailable(String email) {
        if (userRepository.existsByEmailIgnoreCase(cleanEmail(email))) {
            throw new ConflictException("An account with this email already exists. If it is not confirmed yet, resend the confirmation email.");
        }
    }

    private void ensurePhoneAvailable(String phoneNumber) {
        if (userRepository.existsByPhoneNumber(clean(phoneNumber))) {
            throw new ConflictException("An account with this phone number already exists.");
        }
    }

    private void sendVerificationEmail(User user) {
        emailVerificationTokenRepository.deleteByUser(user);

        EmailVerificationToken token = new EmailVerificationToken();
        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiresAt(LocalDateTime.now().plusMinutes(verificationExpirationMinutes));
        emailVerificationTokenRepository.save(token);

        try {
            authMailService.sendEmailVerification(user, token.getToken());
        } catch (MailException ex) {
            throw new BadRequestException("Your account was created, but the confirmation email could not be sent. Check mail settings and try again.");
        }
    }

    private void sendPasswordResetEmail(User user, String token) {
        try {
            authMailService.sendPasswordReset(user, token);
        } catch (MailException ex) {
            throw new BadRequestException("The password reset email could not be sent right now.");
        }
    }

    private boolean requiresEmailVerification(User user) {
        return !user.isEnabled()
                && user.getStatus() != UserStatus.SUSPENDED
                && user.getStatus() != UserStatus.REJECTED;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isBlank();
    }

    private String cleanEmail(String value) {
        return hasText(value) ? value.trim().toLowerCase(Locale.ROOT) : null;
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
