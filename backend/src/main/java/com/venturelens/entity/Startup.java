package com.venturelens.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "startups")
public class Startup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "founder_name", nullable = false)
    private String founderName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "funding_stage")
    private String fundingStage = "Seed";

    @Column(name = "target_money")
    private Double targetMoney = 0.0;

    @Column(name = "yearly_revenue")
    private Double yearlyRevenue = 0.0;

    @Column(name = "monthly_expenses")
    private Double monthlyExpenses = 0.0;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "startup", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private PitchDeck pitchDeck;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.isActive == null) {
            this.isActive = true;
        }
        if (this.targetMoney == null) {
            this.targetMoney = 0.0;
        }
        if (this.yearlyRevenue == null) {
            this.yearlyRevenue = 0.0;
        }
        if (this.monthlyExpenses == null) {
            this.monthlyExpenses = 0.0;
        }
        if (this.fundingStage == null || this.fundingStage.isBlank()) {
            this.fundingStage = "Seed";
        }
    }

    public Startup() {
    }

    public Startup(String founderName, String email, String password, String companyName, String category) {
        this.founderName = founderName;
        this.email = email;
        this.password = password;
        this.companyName = companyName;
        this.category = category;
    }

    // Getters and Setters
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public PitchDeck getPitchDeck() {
        return pitchDeck;
    }

    public void setPitchDeck(PitchDeck pitchDeck) {
        this.pitchDeck = pitchDeck;
    }
}
