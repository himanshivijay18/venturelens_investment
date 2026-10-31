package com.venturelens.dto;

import java.time.LocalDateTime;

public class MeetingResponseDto {
    private Long id;
    private Long investorId;
    private String investorName;
    private String investorFirmName;
    private String investorEmail;

    private Long startupId;
    private String startupCompanyName;
    private String startupFounderName;
    private String startupCategory;

    private String message;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MeetingResponseDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getInvestorId() {
        return investorId;
    }

    public void setInvestorId(Long investorId) {
        this.investorId = investorId;
    }

    public String getInvestorName() {
        return investorName;
    }

    public void setInvestorName(String investorName) {
        this.investorName = investorName;
    }

    public String getInvestorFirmName() {
        return investorFirmName;
    }

    public void setInvestorFirmName(String investorFirmName) {
        this.investorFirmName = investorFirmName;
    }

    public String getInvestorEmail() {
        return investorEmail;
    }

    public void setInvestorEmail(String investorEmail) {
        this.investorEmail = investorEmail;
    }

    public Long getStartupId() {
        return startupId;
    }

    public void setStartupId(Long startupId) {
        this.startupId = startupId;
    }

    public String getStartupCompanyName() {
        return startupCompanyName;
    }

    public void setStartupCompanyName(String startupCompanyName) {
        this.startupCompanyName = startupCompanyName;
    }

    public String getStartupFounderName() {
        return startupFounderName;
    }

    public void setStartupFounderName(String startupFounderName) {
        this.startupFounderName = startupFounderName;
    }

    public String getStartupCategory() {
        return startupCategory;
    }

    public void setStartupCategory(String startupCategory) {
        this.startupCategory = startupCategory;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
