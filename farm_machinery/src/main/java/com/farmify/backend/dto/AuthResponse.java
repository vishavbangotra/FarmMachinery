package com.farmify.backend.dto;

public class AuthResponse {
    private boolean success;
    private String message;
    private String token;
    private boolean newUser;

    public AuthResponse(boolean success, String message, String token, boolean newUser) {
        this.success = success;
        this.message = message;
        this.newUser = newUser;
        this.token = token;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean getNewUser() {
        return newUser;
    }

    public void setNewUser(boolean newUser) {
        this.newUser = newUser;
    }

}