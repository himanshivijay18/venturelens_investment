package com.venturelens.dto;

import java.util.List;

public class AiRecommendationDto {
    private Long startupId;
    private String companyName;
    private String founderName;
    private String category;
    private String fundingStage;
    private Double targetMoney;
    private Double yearlyRevenue;
    private Double monthlyExpenses;
    private Boolean hasPitchDeck;
    private String pitchDeckFileName;
    private String pitchDeckFileType;
    private Long pitchDeckFileSize;
    private String pitchDeckDownloadUrl;
    private Double deckClarityScore;
    private String deckAiVerdict;
    private List<String> deckSlideHighlights;

    // AI Intelligence & Scoring
    private int matchScore; // 0 - 100
    private String recommendationTier; // HIGH CONVICTION, RECOMMENDED, MODERATE FIT, WATCHLIST
    private String recommendationHeadline;
    private String thesisAlignment;
    private String financialHealthScore; // Excellent, Strong, Moderate, Caution
    private String riskLevel; // Low Risk, Moderate Risk, Elevated Burn
    private double growthVelocityScore; // 0 - 10
    private double capitalEfficiencyScore; // 0 - 10
    private double marketOpportunityScore; // 0 - 10

    private List<String> keyStrengths;
    private List<String> keyRisks;
    private List<String> aiSuggestedQuestions;
    private String detailedAiAnalysis;

    public AiRecommendationDto() {
    }

    public Long getStartupId() {
        return startupId;
    }

    public void setStartupId(Long startupId) {
        this.startupId = startupId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getFounderName() {
        return founderName;
    }

    public void setFounderName(String founderName) {
        this.founderName = founderName;
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

    public Boolean getHasPitchDeck() {
        return hasPitchDeck;
    }

    public void setHasPitchDeck(Boolean hasPitchDeck) {
        this.hasPitchDeck = hasPitchDeck;
    }

    public int getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(int matchScore) {
        this.matchScore = matchScore;
    }

    public String getRecommendationTier() {
        return recommendationTier;
    }

    public void setRecommendationTier(String recommendationTier) {
        this.recommendationTier = recommendationTier;
    }

    public String getRecommendationHeadline() {
        return recommendationHeadline;
    }

    public void setRecommendationHeadline(String recommendationHeadline) {
        this.recommendationHeadline = recommendationHeadline;
    }

    public String getThesisAlignment() {
        return thesisAlignment;
    }

    public void setThesisAlignment(String thesisAlignment) {
        this.thesisAlignment = thesisAlignment;
    }

    public String getFinancialHealthScore() {
        return financialHealthScore;
    }

    public void setFinancialHealthScore(String financialHealthScore) {
        this.financialHealthScore = financialHealthScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public double getGrowthVelocityScore() {
        return growthVelocityScore;
    }

    public void setGrowthVelocityScore(double growthVelocityScore) {
        this.growthVelocityScore = growthVelocityScore;
    }

    public double getCapitalEfficiencyScore() {
        return capitalEfficiencyScore;
    }

    public void setCapitalEfficiencyScore(double capitalEfficiencyScore) {
        this.capitalEfficiencyScore = capitalEfficiencyScore;
    }

    public double getMarketOpportunityScore() {
        return marketOpportunityScore;
    }

    public void setMarketOpportunityScore(double marketOpportunityScore) {
        this.marketOpportunityScore = marketOpportunityScore;
    }

    public List<String> getKeyStrengths() {
        return keyStrengths;
    }

    public void setKeyStrengths(List<String> keyStrengths) {
        this.keyStrengths = keyStrengths;
    }

    public List<String> getKeyRisks() {
        return keyRisks;
    }

    public void setKeyRisks(List<String> keyRisks) {
        this.keyRisks = keyRisks;
    }

    public List<String> getAiSuggestedQuestions() {
        return aiSuggestedQuestions;
    }

    public void setAiSuggestedQuestions(List<String> aiSuggestedQuestions) {
        this.aiSuggestedQuestions = aiSuggestedQuestions;
    }

    public String getDetailedAiAnalysis() {
        return detailedAiAnalysis;
    }

    public void setDetailedAiAnalysis(String detailedAiAnalysis) {
        this.detailedAiAnalysis = detailedAiAnalysis;
    }

    public String getPitchDeckFileName() {
        return pitchDeckFileName;
    }

    public void setPitchDeckFileName(String pitchDeckFileName) {
        this.pitchDeckFileName = pitchDeckFileName;
    }

    public String getPitchDeckFileType() {
        return pitchDeckFileType;
    }

    public void setPitchDeckFileType(String pitchDeckFileType) {
        this.pitchDeckFileType = pitchDeckFileType;
    }

    public Long getPitchDeckFileSize() {
        return pitchDeckFileSize;
    }

    public void setPitchDeckFileSize(Long pitchDeckFileSize) {
        this.pitchDeckFileSize = pitchDeckFileSize;
    }

    public String getPitchDeckDownloadUrl() {
        return pitchDeckDownloadUrl;
    }

    public void setPitchDeckDownloadUrl(String pitchDeckDownloadUrl) {
        this.pitchDeckDownloadUrl = pitchDeckDownloadUrl;
    }

    public Double getDeckClarityScore() {
        return deckClarityScore;
    }

    public void setDeckClarityScore(Double deckClarityScore) {
        this.deckClarityScore = deckClarityScore;
    }

    public String getDeckAiVerdict() {
        return deckAiVerdict;
    }

    public void setDeckAiVerdict(String deckAiVerdict) {
        this.deckAiVerdict = deckAiVerdict;
    }

    public List<String> getDeckSlideHighlights() {
        return deckSlideHighlights;
    }

    public void setDeckSlideHighlights(List<String> deckSlideHighlights) {
        this.deckSlideHighlights = deckSlideHighlights;
    }
}
