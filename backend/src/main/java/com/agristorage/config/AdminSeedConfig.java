package com.agristorage.config;

import com.agristorage.entity.user.User;
import com.agristorage.enums.Role;
import com.agristorage.enums.UserStatus;
import com.agristorage.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminSeedConfig {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedDefaultAdmin() {
        return args -> {
            String adminEmail = "admin@coldchain.rw";

            if (userRepository.findByEmail(adminEmail).isPresent()) {
                return;
            }

            User admin = User.builder()
                    .fullName("System Admin")
                    .email(adminEmail)
                    .phoneNumber("0780000000")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .enabled(true)
                    .build();

            userRepository.save(admin);
        };
    }
}
