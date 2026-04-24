package com.agristorage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class JwtResponse {

    private String token;
    private String tokenType;
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String status;
}
