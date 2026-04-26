package com.agristorage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RegistrationResponse {
    private String message;
    private Long userId;
    private String role;
    private String status;
}
