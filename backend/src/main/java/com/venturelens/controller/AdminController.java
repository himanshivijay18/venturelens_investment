package com.venturelens.controller;

import com.venturelens.dto.*;
import com.venturelens.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
        return ResponseEntity.ok(adminService.login(req));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDto> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/startups")
    public ResponseEntity<List<StartupResponseDto>> getStartups(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getAllStartups(search));
    }

    @GetMapping("/investors")
    public ResponseEntity<List<InvestorResponseDto>> getInvestors(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(adminService.getAllInvestors(search));
    }

    @GetMapping("/meetings")
    public ResponseEntity<List<MeetingResponseDto>> getMeetings() {
        return ResponseEntity.ok(adminService.getAllMeetings());
    }

    @PutMapping("/startups/{id}/status")
    public ResponseEntity<StartupResponseDto> updateStartupStatus(
        @PathVariable Long id,
        @Valid @RequestBody StatusUpdateRequest req
    ) {
        return ResponseEntity.ok(adminService.updateStartupStatus(id, req.getIsActive()));
    }

    @PutMapping("/investors/{id}/status")
    public ResponseEntity<InvestorResponseDto> updateInvestorStatus(
        @PathVariable Long id,
        @Valid @RequestBody StatusUpdateRequest req
    ) {
        return ResponseEntity.ok(adminService.updateInvestorStatus(id, req.getIsActive()));
    }

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsDto> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }
}
