package com.farmify.backend.dto;

import javax.validation.constraints.NotBlank;

public class OtpRequest {
    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    public OtpRequest() {
    }

    public OtpRequest(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}