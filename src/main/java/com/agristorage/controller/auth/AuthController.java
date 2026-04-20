package com.agristorage.controller.auth;

import com.agristorage.dto.request.LoginRequest;
import com.agristorage.dto.request.RegisterFarmerRequest;
import com.agristorage.dto.request.RegisterManagerRequest;
import com.agristorage.dto.request.RegisterTransporterRequest;
import com.agristorage.dto.response.JwtResponse;
import com.agristorage.dto.response.MessageResponse;
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
    public MessageResponse registerFarmer(@Valid @RequestBody RegisterFarmerRequest request) {
        authService.registerFarmer(request);
        return new MessageResponse("Farmer registered");
    }

    @PostMapping("/register/manager")
    public MessageResponse registerManager(@Valid @RequestBody RegisterManagerRequest request) {
        authService.registerManager(request);
        return new MessageResponse("Manager pending approval");
    }

    @PostMapping("/register/transporter")
    public MessageResponse registerTransporter(@Valid @RequestBody RegisterTransporterRequest request) {
        authService.registerTransporter(request);
        return new MessageResponse("Transporter pending approval");
    }

    @PostMapping("/login")
    public JwtResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}