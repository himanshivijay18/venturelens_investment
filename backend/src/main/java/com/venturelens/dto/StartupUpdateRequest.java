package com.venturelens.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class StartupUpdateRequest {
    @NotBlank(message = "Founder Name is required")
    private String founderName;

    @NotBlank(message = "Company Name is required")
    private String companyName;

    @NotBlank(message = "Business Category is required")
    private String category;

    @NotBlank(message = "Funding Stage is required")
    private String fundingStage;

    @NotNull(message = "Target Funding is required")
    private Double targetMoney;

    @NotNull(message = "Yearly Revenue is required")
    private Double yearlyRevenue;

    @NotNull(message = "Monthly Expenses is required")
    private Double monthlyExpenses;

    public StartupUpdateRequest() {
    }

    public String getFounderName() {
        return founderName;
    }

    public void setFounderName(String founderName) {
        this.founderName = founderName;
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
}
