package com.venturelens.dto;

public class AdminDashboardDto {
    private long totalStartups;
    private long activeStartups;
    private long totalInvestors;
    private long activeInvestors;
    private long totalMeetings;
    private long pendingMeetings;
    private long acceptedMeetings;
    private long rejectedMeetings;
    private long totalPitchDecks;
    private double totalTargetFunding;
    private double totalYearlyRevenue;

    public AdminDashboardDto() {
    }

    public long getTotalStartups() {
        return totalStartups;
    }

    public void setTotalStartups(long totalStartups) {
        this.totalStartups = totalStartups;
    }

    public long getActiveStartups() {
        return activeStartups;
    }

    public void setActiveStartups(long activeStartups) {
        this.activeStartups = activeStartups;
    }

    public long getTotalInvestors() {
        return totalInvestors;
    }

    public void setTotalInvestors(long totalInvestors) {
        this.totalInvestors = totalInvestors;
    }

    public long getActiveInvestors() {
        return activeInvestors;
    }

    public void setActiveInvestors(long activeInvestors) {
        this.activeInvestors = activeInvestors;
    }

    public long getTotalMeetings() {
        return totalMeetings;
    }

    public void setTotalMeetings(long totalMeetings) {
        this.totalMeetings = totalMeetings;
    }

    public long getPendingMeetings() {
        return pendingMeetings;
    }

    public void setPendingMeetings(long pendingMeetings) {
        this.pendingMeetings = pendingMeetings;
    }

    public long getAcceptedMeetings() {
        return acceptedMeetings;
    }

    public void setAcceptedMeetings(long acceptedMeetings) {
        this.acceptedMeetings = acceptedMeetings;
    }

    public long getRejectedMeetings() {
        return rejectedMeetings;
    }

    public void setRejectedMeetings(long rejectedMeetings) {
        this.rejectedMeetings = rejectedMeetings;
    }

    public long getTotalPitchDecks() {
        return totalPitchDecks;
    }

    public void setTotalPitchDecks(long totalPitchDecks) {
        this.totalPitchDecks = totalPitchDecks;
    }

    public double getTotalTargetFunding() {
        return totalTargetFunding;
    }

    public void setTotalTargetFunding(double totalTargetFunding) {
        this.totalTargetFunding = totalTargetFunding;
    }

    public double getTotalYearlyRevenue() {
        return totalYearlyRevenue;
    }

    public void setTotalYearlyRevenue(double totalYearlyRevenue) {
        this.totalYearlyRevenue = totalYearlyRevenue;
    }
}
