package com.agristorage.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateOrderRequestRequest {

    @NotNull(message = "Product listing ID is required")
    private Long productListingId;

    @NotBlank(message = "Buyer name is required")
    private String buyerName;

    @NotBlank(message = "Buyer phone is required")
    private String buyerPhone;

    @Email(message = "Invalid email format")
    private String buyerEmail;

    @NotNull(message = "Requested quantity is required")
    @Positive(message = "Requested quantity must be greater than 0")
    private Double requestedQuantity;

    private String message;

    private String deliveryLocation;
}