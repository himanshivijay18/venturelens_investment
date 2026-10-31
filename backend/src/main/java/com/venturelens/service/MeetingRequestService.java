package com.venturelens.service;

import com.venturelens.dto.MeetingRequestCreateDto;
import com.venturelens.dto.MeetingResponseDto;
import com.venturelens.dto.MeetingStatusUpdateDto;
import com.venturelens.entity.Investor;
import com.venturelens.entity.MeetingRequest;
import com.venturelens.entity.Startup;
import com.venturelens.repository.InvestorRepository;
import com.venturelens.repository.MeetingRequestRepository;
import com.venturelens.repository.StartupRepository;
import com.venturelens.security.UserPrincipal;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MeetingRequestService {

    private final MeetingRequestRepository meetingRequestRepository;
    private final InvestorRepository investorRepository;
    private final StartupRepository startupRepository;

    public MeetingRequestService(
        MeetingRequestRepository meetingRequestRepository,
        InvestorRepository investorRepository,
        StartupRepository startupRepository
    ) {
        this.meetingRequestRepository = meetingRequestRepository;
        this.investorRepository = investorRepository;
        this.startupRepository = startupRepository;
    }

    @Transactional
    public MeetingResponseDto createMeetingRequest(MeetingRequestCreateDto req, UserPrincipal principal) {
        Long investorId = req.getInvestorId();
        if (investorId == null) {
            investorId = principal.getUserId();
        }

        // Must be the investor or admin
        if (!principal.getRole().equalsIgnoreCase("ADMIN") && !principal.getUserId().equals(investorId)) {
            throw new AccessDeniedException("You are not authorized to send meeting requests for this investor");
        }

        // Prevent duplicate pending requests for the same investor-startup pair
        if (meetingRequestRepository.existsByInvestorIdAndStartupIdAndStatus(investorId, req.getStartupId(), "PENDING")) {
            throw new IllegalStateException("A pending meeting request already exists for this startup");
        }

        Investor investor = investorRepository.findById(investorId)
            .orElseThrow(() -> new IllegalArgumentException("Investor not found with id: " + req.getInvestorId()));
        Startup startup = startupRepository.findById(req.getStartupId())
            .orElseThrow(() -> new IllegalArgumentException("Startup not found with id: " + req.getStartupId()));

        MeetingRequest meetingRequest = new MeetingRequest(investor, startup, req.getMessage());
        meetingRequest.setStatus("PENDING");

        MeetingRequest saved = meetingRequestRepository.save(meetingRequest);
        return mapToDto(saved);
    }

    public List<MeetingResponseDto> getMeetingsForInvestor(Long investorId, UserPrincipal principal) {
        if (!principal.getRole().equalsIgnoreCase("ADMIN") && !principal.getUserId().equals(investorId)) {
            throw new AccessDeniedException("You are not authorized to view these meeting requests");
        }

        return meetingRequestRepository.findByInvestorIdOrderByCreatedAtDesc(investorId)
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    public List<MeetingResponseDto> getMeetingsForStartup(Long startupId, UserPrincipal principal) {
        if (!principal.getRole().equalsIgnoreCase("ADMIN") && !principal.getUserId().equals(startupId)) {
            throw new AccessDeniedException("You are not authorized to view these meeting requests");
        }

        return meetingRequestRepository.findByStartupIdOrderByCreatedAtDesc(startupId)
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    public List<MeetingResponseDto> getAllMeetings() {
        return meetingRequestRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public MeetingResponseDto updateMeetingStatus(Long id, MeetingStatusUpdateDto req, UserPrincipal principal) {
        MeetingRequest meeting = meetingRequestRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Meeting request not found with id: " + id));

        // Only the recipient startup founder or an admin can accept/reject the meeting
        if (!principal.getRole().equalsIgnoreCase("ADMIN") && !principal.getUserId().equals(meeting.getStartup().getId())) {
            throw new AccessDeniedException("Only the startup founder can respond to this meeting request");
        }

        String status = req.getStatus().toUpperCase();
        if (!status.equals("ACCEPTED") && !status.equals("REJECTED") && !status.equals("PENDING")) {
            throw new IllegalArgumentException("Invalid status. Must be ACCEPTED or REJECTED");
        }

        meeting.setStatus(status);
        MeetingRequest updated = meetingRequestRepository.save(meeting);
        return mapToDto(updated);
    }

    public MeetingResponseDto mapToDto(MeetingRequest m) {
        MeetingResponseDto dto = new MeetingResponseDto();
        dto.setId(m.getId());
        dto.setInvestorId(m.getInvestor().getId());
        dto.setInvestorName(m.getInvestor().getInvestorName());
        dto.setInvestorFirmName(m.getInvestor().getFirmName());
        dto.setInvestorEmail(m.getInvestor().getEmail());

        dto.setStartupId(m.getStartup().getId());
        dto.setStartupCompanyName(m.getStartup().getCompanyName());
        dto.setStartupFounderName(m.getStartup().getFounderName());
        dto.setStartupCategory(m.getStartup().getCategory());

        dto.setMessage(m.getMessage());
        dto.setStatus(m.getStatus());
        dto.setCreatedAt(m.getCreatedAt());
        dto.setUpdatedAt(m.getUpdatedAt());

        return dto;
    }
}
