package com.venturelens.service;

import com.venturelens.dto.StartupResponseDto;
import com.venturelens.entity.Investor;
import com.venturelens.entity.SavedStartup;
import com.venturelens.entity.Startup;
import com.venturelens.repository.InvestorRepository;
import com.venturelens.repository.SavedStartupRepository;
import com.venturelens.repository.StartupRepository;
import com.venturelens.security.UserPrincipal;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavedStartupService {

    private final SavedStartupRepository savedStartupRepository;
    private final InvestorRepository investorRepository;
    private final StartupRepository startupRepository;
    private final StartupService startupService;

    public SavedStartupService(
        SavedStartupRepository savedStartupRepository,
        InvestorRepository investorRepository,
        StartupRepository startupRepository,
        StartupService startupService
    ) {
        this.savedStartupRepository = savedStartupRepository;
        this.investorRepository = investorRepository;
        this.startupRepository = startupRepository;
        this.startupService = startupService;
    }

    public List<StartupResponseDto> getSavedStartups(Long investorId, UserPrincipal principal) {
        // Ownership check
        if (!principal.getRole().equalsIgnoreCase("ADMIN") && !principal.getUserId().equals(investorId)) {
            throw new AccessDeniedException("You are not authorized to view this investor's saved startups");
        }

        List<SavedStartup> savedList = savedStartupRepository.findByInvestorIdOrderByCreatedAtDesc(investorId);
        return savedList.stream()
            .map(s -> startupService.mapToDto(s.getStartup(), investorId))
            .collect(Collectors.toList());
    }

    @Transactional
    public void saveStartup(Long investorId, Long startupId, UserPrincipal principal) {
        if (!principal.getRole().equalsIgnoreCase("ADMIN") && !principal.getUserId().equals(investorId)) {
            throw new AccessDeniedException("You are not authorized to bookmark for this investor");
        }

        if (savedStartupRepository.existsByInvestorIdAndStartupId(investorId, startupId)) {
            return; // Already bookmarked, idempotent
        }

        Investor investor = investorRepository.findById(investorId)
            .orElseThrow(() -> new IllegalArgumentException("Investor not found with id: " + investorId));
        Startup startup = startupRepository.findById(startupId)
            .orElseThrow(() -> new IllegalArgumentException("Startup not found with id: " + startupId));

        SavedStartup savedStartup = new SavedStartup(investor, startup);
        savedStartupRepository.save(savedStartup);
    }

    @Transactional
    public void removeSavedStartup(Long investorId, Long startupId, UserPrincipal principal) {
        if (!principal.getRole().equalsIgnoreCase("ADMIN") && !principal.getUserId().equals(investorId)) {
            throw new AccessDeniedException("You are not authorized to remove bookmark for this investor");
        }

        savedStartupRepository.deleteByInvestorIdAndStartupId(investorId, startupId);
    }
}
