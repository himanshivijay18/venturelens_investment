package com.venturelens.dto;

import java.time.LocalDateTime;

public class InvestorResponseDto {
    private Long id;
    private String investorName;
    private String email;
    private String firmName;
    private String interestedCategory;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private Long savedStartupsCount;
    private Long meetingRequestsSentCount;
    private Long acceptedMeetingsCount;

    public InvestorResponseDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInvestorName() {
        return investorName;
    }

    public void setInvestorName(String investorName) {
        this.investorName = investorName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirmName() {
        return firmName;
    }

    public void setFirmName(String firmName) {
        this.firmName = firmName;
    }

    public String getInterestedCategory() {
        return interestedCategory;
    }

    public void setInterestedCategory(String interestedCategory) {
        this.interestedCategory = interestedCategory;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getSavedStartupsCount() {
        return savedStartupsCount;
    }

    public void setSavedStartupsCount(Long savedStartupsCount) {
        this.savedStartupsCount = savedStartupsCount;
    }

    public Long getMeetingRequestsSentCount() {
        return meetingRequestsSentCount;
    }

    public void setMeetingRequestsSentCount(Long meetingRequestsSentCount) {
        this.meetingRequestsSentCount = meetingRequestsSentCount;
    }

    public Long getAcceptedMeetingsCount() {
        return acceptedMeetingsCount;
    }

    public void setAcceptedMeetingsCount(Long acceptedMeetingsCount) {
        this.acceptedMeetingsCount = acceptedMeetingsCount;
    }
}
