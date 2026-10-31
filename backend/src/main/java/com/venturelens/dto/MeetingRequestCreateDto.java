package com.venturelens.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MeetingRequestCreateDto {
    @NotNull(message = "Startup ID is required")
    private Long startupId;

    private Long investorId;

    @NotBlank(message = "Meeting message is required")
    private String message;

    public MeetingRequestCreateDto() {
    }

    public Long getStartupId() {
        return startupId;
    }

    public void setStartupId(Long startupId) {
        this.startupId = startupId;
    }

    public Long getInvestorId() {
        return investorId;
    }

    public void setInvestorId(Long investorId) {
        this.investorId = investorId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
