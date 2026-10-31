package com.venturelens.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class MeetingStatusUpdateDto {
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "ACCEPTED|REJECTED|PENDING", message = "Status must be ACCEPTED, REJECTED, or PENDING")
    private String status;

    public MeetingStatusUpdateDto() {
    }

    public MeetingStatusUpdateDto(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
