package com.venturelens.controller;

import com.venturelens.dto.*;
import com.venturelens.security.UserPrincipal;
import com.venturelens.service.AiRecommendationService;
import com.venturelens.service.StartupService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/startup")
@CrossOrigin(origins = "*")
public class StartupController {

    private final StartupService startupService;
    private final AiRecommendationService aiRecommendationService;

    public StartupController(StartupService startupService, AiRecommendationService aiRecommendationService) {
        this.startupService = startupService;
        this.aiRecommendationService = aiRecommendationService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody StartupRegisterRequest req) {
        return ResponseEntity.ok(startupService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        return ResponseEntity.ok(startupService.login(req));
    }

    @GetMapping("/all")
    public ResponseEntity<List<StartupResponseDto>> getAllStartups(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String fundingStage,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long investorId = (principal != null && "INVESTOR".equalsIgnoreCase(principal.getRole())) ? principal.getUserId() : null;
        return ResponseEntity.ok(startupService.getAllStartups(search, category, fundingStage, investorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StartupResponseDto> getStartupById(
        @PathVariable Long id,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long investorId = (principal != null && "INVESTOR".equalsIgnoreCase(principal.getRole())) ? principal.getUserId() : null;
        return ResponseEntity.ok(startupService.getStartupById(id, investorId));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<StartupResponseDto> updateStartup(
        @PathVariable Long id,
        @Valid @RequestBody StartupUpdateRequest req,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(startupService.updateStartup(id, req, principal));
    }

    @GetMapping("/{id}/ai-diligence")
    public ResponseEntity<AiRecommendationDto> getAiDueDiligence(
        @PathVariable Long id,
        @RequestParam(required = false) Long investorId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long targetInvestorId = investorId;
        if (targetInvestorId == null && principal != null && "INVESTOR".equalsIgnoreCase(principal.getRole())) {
            targetInvestorId = principal.getUserId();
        }
        return ResponseEntity.ok(aiRecommendationService.getAiDueDiligence(id, targetInvestorId));
    }
}
