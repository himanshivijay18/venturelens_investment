package com.venturelens.controller;

import com.venturelens.dto.AuthResponse;
import com.venturelens.security.UserPrincipal;
import com.venturelens.service.InvestorService;
import com.venturelens.service.StartupService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final StartupService startupService;
    private final InvestorService investorService;

    public AuthController(StartupService startupService, InvestorService investorService) {
        this.startupService = startupService;
        this.investorService = investorService;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Unauthenticated");
        }

        Object profile = null;
        if ("STARTUP".equalsIgnoreCase(principal.getRole())) {
            profile = startupService.getStartupById(principal.getUserId(), null);
        } else if ("INVESTOR".equalsIgnoreCase(principal.getRole())) {
            profile = investorService.getInvestorById(principal.getUserId());
        }

        AuthResponse resp = new AuthResponse(
            null,
            principal.getRole(),
            principal.getUserId(),
            principal.getName(),
            principal.getUsername(),
            profile
        );
        return ResponseEntity.ok(resp);
    }
}
