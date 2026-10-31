package com.venturelens.service;

import com.venturelens.dto.AuthRequest;
import com.venturelens.dto.AuthResponse;
import com.venturelens.dto.InvestorRegisterRequest;
import com.venturelens.dto.InvestorResponseDto;
import com.venturelens.entity.Investor;
import com.venturelens.repository.MeetingRequestRepository;
import com.venturelens.repository.SavedStartupRepository;
import com.venturelens.repository.InvestorRepository;
import com.venturelens.repository.StartupRepository;
import com.venturelens.security.TokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvestorService {

    private final InvestorRepository investorRepository;
    private final StartupRepository startupRepository;
    private final SavedStartupRepository savedStartupRepository;
    private final MeetingRequestRepository meetingRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public InvestorService(
        InvestorRepository investorRepository,
        StartupRepository startupRepository,
        SavedStartupRepository savedStartupRepository,
        MeetingRequestRepository meetingRequestRepository,
        PasswordEncoder passwordEncoder,
        TokenService tokenService
    ) {
        this.investorRepository = investorRepository;
        this.startupRepository = startupRepository;
        this.savedStartupRepository = savedStartupRepository;
        this.meetingRequestRepository = meetingRequestRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Transactional
    public AuthResponse register(InvestorRegisterRequest req) {
        if (investorRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email is already registered. Please log in or use another email.");
        }

        Investor investor = new Investor(
            req.getInvestorName(),
            req.getEmail(),
            passwordEncoder.encode(req.getPassword()),
            req.getFirmName(),
            req.getInterestedCategory()
        );
        investor.setIsActive(true);

        Investor saved = investorRepository.save(investor);

        String token = tokenService.generateToken(saved.getId(), saved.getEmail(), "INVESTOR", saved.getInvestorName());
        InvestorResponseDto profile = mapToDto(saved);

        return new AuthResponse(token, "INVESTOR", saved.getId(), saved.getInvestorName(), saved.getEmail(), profile);
    }

    public AuthResponse login(AuthRequest req) {
        Investor investor = investorRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), investor.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (Boolean.FALSE.equals(investor.getIsActive())) {
            throw new IllegalStateException("Your investor account has been deactivated. Please contact platform administration.");
        }

        String token = tokenService.generateToken(investor.getId(), investor.getEmail(), "INVESTOR", investor.getInvestorName());
        InvestorResponseDto profile = mapToDto(investor);

        return new AuthResponse(token, "INVESTOR", investor.getId(), investor.getInvestorName(), investor.getEmail(), profile);
    }

    public List<InvestorResponseDto> getAllInvestors(String search) {
        List<Investor> list = investorRepository.searchInvestors(search);
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public InvestorResponseDto getInvestorById(Long id) {
        Investor investor = investorRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Investor not found with id: " + id));
        return mapToDto(investor);
    }

    public InvestorResponseDto mapToDto(Investor investor) {
        InvestorResponseDto dto = new InvestorResponseDto();
        dto.setId(investor.getId());
        dto.setInvestorName(investor.getInvestorName());
        dto.setEmail(investor.getEmail());
        dto.setFirmName(investor.getFirmName());
        dto.setInterestedCategory(investor.getInterestedCategory());
        dto.setIsActive(investor.getIsActive());
        dto.setCreatedAt(investor.getCreatedAt());

        long savedCount = savedStartupRepository.countByInvestorId(investor.getId());
        dto.setSavedStartupsCount(savedCount);

        long meetingsSent = meetingRequestRepository.countByInvestorId(investor.getId());
        dto.setMeetingRequestsSentCount(meetingsSent);

        long acceptedCount = meetingRequestRepository.countByInvestorIdAndStatus(investor.getId(), "ACCEPTED");
        dto.setAcceptedMeetingsCount(acceptedCount);

        return dto;
    }
}
