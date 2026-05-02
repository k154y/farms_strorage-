package com.agristorage.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleTokenInfoResponse {

    private String aud;
    private String email;
    private String sub;

    @JsonProperty("email_verified")
    private String emailVerified;
}
