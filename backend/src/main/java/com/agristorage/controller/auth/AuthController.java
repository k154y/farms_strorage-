package com.agristorage.controller.auth;

import com.agristorage.dto.request.LoginRequest;
import com.agristorage.dto.request.RegisterFarmerRequest;
import com.agristorage.dto.request.RegisterManagerRequest;
import com.agristorage.dto.request.RegisterTransporterRequest;
import com.agristorage.dto.response.JwtResponse;
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
}
