package com.farmify.backend.dto;

import javax.validation.constraints.NotBlank;

public class OtpVerifyRequest {
    @NotBlank(message = "Phone number is required")
    private String phoneNumber;
    @NotBlank(message = "OTP is required")
    private String otp;

    public OtpVerifyRequest() {
    }

    public OtpVerifyRequest(String phoneNumber, String otp) {
        this.phoneNumber = phoneNumber;
        this.otp = otp;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}
