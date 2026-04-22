package com.agristorage.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApprovalRequest {
    private String comment;
    private String reason;
}
