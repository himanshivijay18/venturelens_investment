package com.venturelens.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsDto {
    private List<Map<String, Object>> startupsByCategory;
    private List<Map<String, Object>> meetingRequestsByStatus;
    private List<Map<String, Object>> registrationsOverTime;
    private List<Map<String, Object>> monthlyPlatformActivity;

    public AnalyticsDto() {
    }

    public List<Map<String, Object>> getStartupsByCategory() {
        return startupsByCategory;
    }

    public void setStartupsByCategory(List<Map<String, Object>> startupsByCategory) {
        this.startupsByCategory = startupsByCategory;
    }

    public List<Map<String, Object>> getMeetingRequestsByStatus() {
        return meetingRequestsByStatus;
    }

    public void setMeetingRequestsByStatus(List<Map<String, Object>> meetingRequestsByStatus) {
        this.meetingRequestsByStatus = meetingRequestsByStatus;
    }

    public List<Map<String, Object>> getRegistrationsOverTime() {
        return registrationsOverTime;
    }

    public void setRegistrationsOverTime(List<Map<String, Object>> registrationsOverTime) {
        this.registrationsOverTime = registrationsOverTime;
    }

    public List<Map<String, Object>> getMonthlyPlatformActivity() {
        return monthlyPlatformActivity;
    }

    public void setMonthlyPlatformActivity(List<Map<String, Object>> monthlyPlatformActivity) {
        this.monthlyPlatformActivity = monthlyPlatformActivity;
    }
}
