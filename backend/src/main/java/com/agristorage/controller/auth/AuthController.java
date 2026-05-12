package com.agristorage.controller.auth;

import com.agristorage.dto.request.ForgotPasswordRequest;
import com.agristorage.dto.request.GoogleLoginRequest;
import com.agristorage.dto.request.GoogleRegisterRequest;
import com.agristorage.dto.request.LoginRequest;
import com.agristorage.dto.request.ResendVerificationEmailRequest;
import com.agristorage.dto.request.ResetPasswordRequest;
import com.agristorage.dto.request.RegisterFarmerRequest;
import com.agristorage.dto.request.RegisterManagerRequest;
import com.agristorage.dto.request.RegisterTransporterRequest;
import com.agristorage.dto.response.JwtResponse;
import com.agristorage.dto.response.MessageResponse;
import com.agristorage.dto.response.RegistrationResponse;
import com.agristorage.service.auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/farmer")
    public RegistrationResponse registerFarmer(@Valid @RequestBody RegisterFarmerRequest request) {
        return authService.registerFarmer(request);
    }

    @PostMapping("/register/storage-manager")
    public RegistrationResponse registerManager(@Valid @RequestBody RegisterManagerRequest request) {
        return authService.registerManager(request);
    }

    @PostMapping("/register/transporter")
    public RegistrationResponse registerTransporter(@Valid @RequestBody RegisterTransporterRequest request) {
        return authService.registerTransporter(request);
    }

    @PostMapping("/login")
    public JwtResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/google")
    public JwtResponse loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request) {
        return authService.loginWithGoogle(request);
    }

    @PostMapping("/register/google")
    public MessageResponse registerWithGoogle(@Valid @RequestBody GoogleRegisterRequest request) {
        return authService.registerWithGoogle(request);
    }

    @GetMapping("/verify-email")
    public MessageResponse verifyEmail(@RequestParam String token) {
        return authService.verifyEmail(token);
    }

    @PostMapping("/forgot-password")
    public MessageResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    @PostMapping("/resend-verification")
    public MessageResponse resendVerification(@Valid @RequestBody ResendVerificationEmailRequest request) {
        return authService.resendVerificationEmail(request);
    }

    @PostMapping("/reset-password")
    public MessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }
}
