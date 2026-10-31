package com.venturelens.dto;

import java.time.LocalDateTime;

public class StartupResponseDto {
    private Long id;
    private String founderName;
    private String email;
    private String companyName;
    private String category;
    private String fundingStage;
    private Double targetMoney;
    private Double yearlyRevenue;
    private Double monthlyExpenses;
    private Boolean isActive;
    private LocalDateTime createdAt;

    // Pitch deck details
    private Boolean hasPitchDeck;
    private Long pitchDeckId;
    private String pitchDeckFileName;
    private Long pitchDeckSize;
    private LocalDateTime pitchDeckUploadedAt;

    // Stats
    private Long meetingRequestsCount;
    private Boolean isSavedByCurrentInvestor;

    // AI Intelligence & Recommendation Fields
    private Integer aiMatchScore;
    private String aiRecommendationTier;
    private String aiThesisMatch;
    private String aiScore = "Not Assessed";
    private String riskLevel = "NOT ASSESSED";
    private Double growthVelocityScore;

    public StartupResponseDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFounderName() {
        return founderName;
    }

    public void setFounderName(String founderName) {
        this.founderName = founderName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getFundingStage() {
        return fundingStage;
    }

    public void setFundingStage(String fundingStage) {
        this.fundingStage = fundingStage;
    }

    public Double getTargetMoney() {
        return targetMoney;
    }

    public void setTargetMoney(Double targetMoney) {
        this.targetMoney = targetMoney;
    }

    public Double getYearlyRevenue() {
        return yearlyRevenue;
    }

    public void setYearlyRevenue(Double yearlyRevenue) {
        this.yearlyRevenue = yearlyRevenue;
    }

    public Double getMonthlyExpenses() {
        return monthlyExpenses;
    }

    public void setMonthlyExpenses(Double monthlyExpenses) {
        this.monthlyExpenses = monthlyExpenses;
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

    public Boolean getHasPitchDeck() {
        return hasPitchDeck;
    }

    public void setHasPitchDeck(Boolean hasPitchDeck) {
        this.hasPitchDeck = hasPitchDeck;
    }

    public Long getPitchDeckId() {
        return pitchDeckId;
    }

    public void setPitchDeckId(Long pitchDeckId) {
        this.pitchDeckId = pitchDeckId;
    }

    public String getPitchDeckFileName() {
        return pitchDeckFileName;
    }

    public void setPitchDeckFileName(String pitchDeckFileName) {
        this.pitchDeckFileName = pitchDeckFileName;
    }

    public Long getPitchDeckSize() {
        return pitchDeckSize;
    }

    public void setPitchDeckSize(Long pitchDeckSize) {
        this.pitchDeckSize = pitchDeckSize;
    }

    public LocalDateTime getPitchDeckUploadedAt() {
        return pitchDeckUploadedAt;
    }

    public void setPitchDeckUploadedAt(LocalDateTime pitchDeckUploadedAt) {
        this.pitchDeckUploadedAt = pitchDeckUploadedAt;
    }

    public Long getMeetingRequestsCount() {
        return meetingRequestsCount;
    }

    public void setMeetingRequestsCount(Long meetingRequestsCount) {
        this.meetingRequestsCount = meetingRequestsCount;
    }

    public Boolean getIsSavedByCurrentInvestor() {
        return isSavedByCurrentInvestor;
    }

    public void setIsSavedByCurrentInvestor(Boolean isSavedByCurrentInvestor) {
        this.isSavedByCurrentInvestor = isSavedByCurrentInvestor;
    }

    public Integer getAiMatchScore() {
        return aiMatchScore;
    }

    public void setAiMatchScore(Integer aiMatchScore) {
        this.aiMatchScore = aiMatchScore;
    }

    public String getAiRecommendationTier() {
        return aiRecommendationTier;
    }

    public void setAiRecommendationTier(String aiRecommendationTier) {
        this.aiRecommendationTier = aiRecommendationTier;
    }

    public String getAiThesisMatch() {
        return aiThesisMatch;
    }

    public void setAiThesisMatch(String aiThesisMatch) {
        this.aiThesisMatch = aiThesisMatch;
    }

    public String getAiScore() {
        return aiScore;
    }

    public void setAiScore(String aiScore) {
        this.aiScore = aiScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Double getGrowthVelocityScore() {
        return growthVelocityScore;
    }

    public void setGrowthVelocityScore(Double growthVelocityScore) {
        this.growthVelocityScore = growthVelocityScore;
    }
}
