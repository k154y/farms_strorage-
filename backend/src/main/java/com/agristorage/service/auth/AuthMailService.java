package com.agristorage.service.auth;

import com.agristorage.entity.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthMailService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${app.mail.from:}")
    private String fromAddress;

    @Value("${app.frontend-url:https://farms-strorage.vercel.app}")
    private String frontendUrl;

    public void sendEmailVerification(User user, String token) {
        String verificationUrl = normalizedFrontendUrl() + "/verify-email?token=" + token;
        send(
                user.getEmail(),
                "Confirm your ColdChain account",
                "Hello " + user.getFullName() + ",\n\n"
                        + "Please confirm your account by clicking this link:\n"
                        + verificationUrl + "\n\n"
                        + "If you did not create this account, you can ignore this email."
        );
    }

    public void sendPasswordReset(User user, String token) {
        String resetUrl = normalizedFrontendUrl() + "/reset-password?token=" + token;
        send(
                user.getEmail(),
                "Reset your ColdChain password",
                "Hello " + user.getFullName() + ",\n\n"
                        + "Use this link to reset your password:\n"
                        + resetUrl + "\n\n"
                        + "If you did not request a password reset, you can ignore this email."
        );
    }

    private void send(String to, String subject, String text) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            throw new IllegalStateException("Mail sender is not configured.");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        if (fromAddress != null && !fromAddress.isBlank()) {
            message.setFrom(fromAddress);
        }
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    private String normalizedFrontendUrl() {
        if (frontendUrl == null || frontendUrl.isBlank()) {
            return "https://farms-strorage.vercel.app";
        }

        return frontendUrl.endsWith("/") ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
    }
}
