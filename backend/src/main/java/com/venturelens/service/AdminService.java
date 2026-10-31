package com.venturelens.service;

import com.venturelens.dto.*;
import com.venturelens.entity.Admin;
import com.venturelens.entity.Investor;
import com.venturelens.entity.MeetingRequest;
import com.venturelens.entity.Startup;
import com.venturelens.repository.*;
import com.venturelens.security.TokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final StartupRepository startupRepository;
    private final InvestorRepository investorRepository;
    private final MeetingRequestRepository meetingRequestRepository;
    private final PitchDeckRepository pitchDeckRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final StartupService startupService;
    private final InvestorService investorService;
    private final MeetingRequestService meetingRequestService;

    public AdminService(
        AdminRepository adminRepository,
        StartupRepository startupRepository,
        InvestorRepository investorRepository,
        MeetingRequestRepository meetingRequestRepository,
        PitchDeckRepository pitchDeckRepository,
        PasswordEncoder passwordEncoder,
        TokenService tokenService,
        StartupService startupService,
        InvestorService investorService,
        MeetingRequestService meetingRequestService
    ) {
        this.adminRepository = adminRepository;
        this.startupRepository = startupRepository;
        this.investorRepository = investorRepository;
        this.meetingRequestRepository = meetingRequestRepository;
        this.pitchDeckRepository = pitchDeckRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
        this.startupService = startupService;
        this.investorService = investorService;
        this.meetingRequestService = meetingRequestService;
    }

    public AuthResponse login(AuthRequest req) {
        Admin admin = adminRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Invalid admin credentials"));

        if (!passwordEncoder.matches(req.getPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("Invalid admin credentials");
        }

        String token = tokenService.generateToken(admin.getId(), admin.getEmail(), "ADMIN", admin.getName());
        return new AuthResponse(token, "ADMIN", admin.getId(), admin.getName(), admin.getEmail(), null);
    }

    public AdminDashboardDto getDashboardStats() {
        AdminDashboardDto dto = new AdminDashboardDto();
        dto.setTotalStartups(startupRepository.count());
        dto.setActiveStartups(startupRepository.countByIsActiveTrue());
        dto.setTotalInvestors(investorRepository.count());
        dto.setActiveInvestors(investorRepository.countByIsActiveTrue());

        dto.setTotalMeetings(meetingRequestRepository.count());
        dto.setPendingMeetings(meetingRequestRepository.countByStatus("PENDING"));
        dto.setAcceptedMeetings(meetingRequestRepository.countByStatus("ACCEPTED"));
        dto.setRejectedMeetings(meetingRequestRepository.countByStatus("REJECTED"));

        dto.setTotalPitchDecks(pitchDeckRepository.count());

        List<Startup> allStartups = startupRepository.findAll();
        double targetSum = allStartups.stream().mapToDouble(s -> s.getTargetMoney() != null ? s.getTargetMoney() : 0.0).sum();
        double revenueSum = allStartups.stream().mapToDouble(s -> s.getYearlyRevenue() != null ? s.getYearlyRevenue() : 0.0).sum();
        dto.setTotalTargetFunding(targetSum);
        dto.setTotalYearlyRevenue(revenueSum);

        return dto;
    }

    public List<StartupResponseDto> getAllStartups(String search) {
        List<Startup> list;
        if (search != null && !search.isBlank()) {
            list = startupRepository.searchStartups(search, null, null);
        } else {
            list = startupRepository.findAll();
        }
        return list.stream().map(s -> startupService.mapToDto(s, null)).collect(Collectors.toList());
    }

    public List<InvestorResponseDto> getAllInvestors(String search) {
        return investorService.getAllInvestors(search);
    }

    public List<MeetingResponseDto> getAllMeetings() {
        return meetingRequestService.getAllMeetings();
    }

    @Transactional
    public StartupResponseDto updateStartupStatus(Long id, boolean isActive) {
        Startup startup = startupRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Startup not found with id: " + id));
        startup.setIsActive(isActive);
        Startup saved = startupRepository.save(startup);
        return startupService.mapToDto(saved, null);
    }

    @Transactional
    public InvestorResponseDto updateInvestorStatus(Long id, boolean isActive) {
        Investor investor = investorRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Investor not found with id: " + id));
        investor.setIsActive(isActive);
        Investor saved = investorRepository.save(investor);
        return investorService.mapToDto(saved);
    }

    public AnalyticsDto getAnalytics() {
        AnalyticsDto dto = new AnalyticsDto();

        // 1. Startups by category
        List<Object[]> categoryCounts = startupRepository.countStartupsByCategory();
        List<Map<String, Object>> catList = new ArrayList<>();
        for (Object[] row : categoryCounts) {
            Map<String, Object> map = new HashMap<>();
            map.put("category", row[0] != null ? row[0] : "Other");
            map.put("count", row[1]);
            catList.add(map);
        }
        dto.setStartupsByCategory(catList);

        // 2. Meeting requests by status
        List<Object[]> statusCounts = meetingRequestRepository.countRequestsByStatus();
        List<Map<String, Object>> statusList = new ArrayList<>();
        for (Object[] row : statusCounts) {
            Map<String, Object> map = new HashMap<>();
            map.put("status", row[0] != null ? row[0] : "UNKNOWN");
            map.put("count", row[1]);
            statusList.add(map);
        }
        dto.setMeetingRequestsByStatus(statusList);

        // 3. Registrations over time (monthly aggregation of startups and investors from DB)
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
        List<Startup> allStartups = startupRepository.findAll();
        List<Investor> allInvestors = investorRepository.findAll();
        List<MeetingRequest> allMeetings = meetingRequestRepository.findAll();

        Map<String, Long> startupMonths = allStartups.stream()
            .filter(s -> s.getCreatedAt() != null)
            .collect(Collectors.groupingBy(s -> s.getCreatedAt().format(monthFormatter), Collectors.counting()));

        Map<String, Long> investorMonths = allInvestors.stream()
            .filter(i -> i.getCreatedAt() != null)
            .collect(Collectors.groupingBy(i -> i.getCreatedAt().format(monthFormatter), Collectors.counting()));

        Map<String, Long> meetingMonths = allMeetings.stream()
            .filter(m -> m.getCreatedAt() != null)
            .collect(Collectors.groupingBy(m -> m.getCreatedAt().format(monthFormatter), Collectors.counting()));

        // Merge all unique months
        Set<String> allPeriods = new LinkedHashSet<>();
        allPeriods.addAll(startupMonths.keySet());
        allPeriods.addAll(investorMonths.keySet());
        allPeriods.addAll(meetingMonths.keySet());

        if (allPeriods.isEmpty()) {
            allPeriods.add("Current Month");
        }

        List<Map<String, Object>> regOverTime = new ArrayList<>();
        List<Map<String, Object>> monthlyActivity = new ArrayList<>();

        for (String period : allPeriods) {
            long sCount = startupMonths.getOrDefault(period, 0L);
            long iCount = investorMonths.getOrDefault(period, 0L);
            long mCount = meetingMonths.getOrDefault(period, 0L);

            Map<String, Object> regMap = new HashMap<>();
            regMap.put("period", period);
            regMap.put("startups", sCount);
            regMap.put("investors", iCount);
            regOverTime.add(regMap);

            Map<String, Object> actMap = new HashMap<>();
            actMap.put("month", period);
            actMap.put("startups", sCount);
            actMap.put("investors", iCount);
            actMap.put("meetings", mCount);
            actMap.put("totalActivity", sCount + iCount + mCount);
            monthlyActivity.add(actMap);
        }

        dto.setRegistrationsOverTime(regOverTime);
        dto.setMonthlyPlatformActivity(monthlyActivity);

        return dto;
    }
}
