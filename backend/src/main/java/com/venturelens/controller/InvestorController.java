package com.venturelens.controller;

import com.venturelens.dto.AiRecommendationDto;
import com.venturelens.dto.AuthRequest;
import com.venturelens.dto.AuthResponse;
import com.venturelens.dto.InvestorRegisterRequest;
import com.venturelens.dto.InvestorResponseDto;
import com.venturelens.service.AiRecommendationService;
import com.venturelens.service.InvestorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/investor")
@CrossOrigin(origins = "*")
public class InvestorController {

    private final InvestorService investorService;
    private final AiRecommendationService aiRecommendationService;

    public InvestorController(InvestorService investorService, AiRecommendationService aiRecommendationService) {
        this.investorService = investorService;
        this.aiRecommendationService = aiRecommendationService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody InvestorRegisterRequest req) {
        return ResponseEntity.ok(investorService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        return ResponseEntity.ok(investorService.login(req));
    }

    @GetMapping("/all")
    public ResponseEntity<List<InvestorResponseDto>> getAllInvestors(
        @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(investorService.getAllInvestors(search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvestorResponseDto> getInvestorById(@PathVariable Long id) {
        return ResponseEntity.ok(investorService.getInvestorById(id));
    }

    @GetMapping("/{investorId}/recommendations")
    public ResponseEntity<List<AiRecommendationDto>> getRecommendations(@PathVariable Long investorId) {
        return ResponseEntity.ok(aiRecommendationService.getRecommendationsForInvestor(investorId));
    }

    @GetMapping("/{investorId}/startup/{startupId}/ai-diligence")
    public ResponseEntity<AiRecommendationDto> getAiDiligence(
        @PathVariable Long investorId,
        @PathVariable Long startupId
    ) {
        return ResponseEntity.ok(aiRecommendationService.getAiDueDiligence(startupId, investorId));
    }
}
