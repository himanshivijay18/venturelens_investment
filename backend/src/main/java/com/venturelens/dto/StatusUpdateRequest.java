package com.venturelens.dto;

import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {
    @NotNull(message = "Active status is required")
    private Boolean isActive;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
