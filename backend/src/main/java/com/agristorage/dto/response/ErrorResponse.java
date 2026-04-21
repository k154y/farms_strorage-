package com.agristorage.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class ErrorResponse {

    private boolean success;
    private String message;
    private int status;
    private LocalDateTime timestamp;
    private Map<String, String> errors;
}