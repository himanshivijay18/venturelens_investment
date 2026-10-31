package com.venturelens.controller;

import com.venturelens.dto.StartupResponseDto;
import com.venturelens.security.UserPrincipal;
import com.venturelens.service.SavedStartupService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/saved-startups")
@CrossOrigin(origins = "*")
public class SavedStartupController {

    private final SavedStartupService savedStartupService;

    public SavedStartupController(SavedStartupService savedStartupService) {
        this.savedStartupService = savedStartupService;
    }

    @GetMapping("/{investorId}")
    public ResponseEntity<List<StartupResponseDto>> getSavedStartups(
        @PathVariable Long investorId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(savedStartupService.getSavedStartups(investorId, principal));
    }

    @PostMapping("/{investorId}/{startupId}")
    public ResponseEntity<Map<String, String>> saveStartup(
        @PathVariable Long investorId,
        @PathVariable Long startupId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        savedStartupService.saveStartup(investorId, startupId, principal);
        return ResponseEntity.ok(Map.of("message", "Startup saved successfully"));
    }

    @DeleteMapping("/{investorId}/{startupId}")
    public ResponseEntity<Map<String, String>> removeSavedStartup(
        @PathVariable Long investorId,
        @PathVariable Long startupId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        savedStartupService.removeSavedStartup(investorId, startupId, principal);
        return ResponseEntity.ok(Map.of("message", "Startup removed from saved list"));
    }
}
