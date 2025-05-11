package com.farmify.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.farmify.backend.model.BookingStatus;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.NotBlank;

public class BookingOwnerDTO {
    @NotNull
    private Long bookingId;
    @NotNull
    private Long machineryId;
    @NotNull
    private Long requesterId;
    @NotNull
    private BookingStatus status;
    @NotNull
    private LocalDateTime createdAt;
    @NotNull
    private LocalDate startDate;
    @NotNull
    private LocalDate endDate;
    @NotBlank
    private String modelInfo;
    private String remarks;
    @NotNull
    private double rentPerDay;
    @NotNull
    private Long farmId;
    @NotNull
    private Long ownerId;
    private String farmDescription;
    private Double latitude;
    private Double longitude;

    public BookingOwnerDTO(
            Long bookingId,
            Long machineryId,
            Long requesterId,
            BookingStatus status,
            LocalDateTime createdAt,
            LocalDate startDate,
            LocalDate endDate,
            String modelInfo,
            String remarks,
            double rentPerDay,
            Long farmId,
            Long ownerId,
            String farmDescription,
            Double latitude,
            Double longitude) {
        this.bookingId = bookingId;
        this.machineryId = machineryId;
        this.requesterId = requesterId;
        this.status = status;
        this.createdAt = createdAt;
        this.startDate = startDate;
        this.endDate = endDate;
        this.modelInfo = modelInfo;
        this.remarks = remarks;
        this.rentPerDay = rentPerDay;
        this.farmId = farmId;
        this.ownerId = ownerId;
        this.farmDescription = farmDescription;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters and setters
    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getMachineryId() {
        return machineryId;
    }

    public void setMachineryId(Long machineryId) {
        this.machineryId = machineryId;
    }

    public Long getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(Long requesterId) {
        this.requesterId = requesterId;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getModelInfo() {
        return modelInfo;
    }

    public void setModelInfo(String modelInfo) {
        this.modelInfo = modelInfo;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public double getRentPerDay() {
        return rentPerDay;
    }

    public void setRentPerDay(double rentPerDay) {
        this.rentPerDay = rentPerDay;
    }

    public Long getFarmId() {
        return farmId;
    }

    public void setFarmId(Long farmId) {
        this.farmId = farmId;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getFarmDescription() {
        return farmDescription;
    }

    public void setFarmDescription(String farmDescription) {
        this.farmDescription = farmDescription;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}