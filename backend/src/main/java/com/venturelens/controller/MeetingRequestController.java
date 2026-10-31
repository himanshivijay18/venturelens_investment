package com.venturelens.controller;

import com.venturelens.dto.MeetingRequestCreateDto;
import com.venturelens.dto.MeetingResponseDto;
import com.venturelens.dto.MeetingStatusUpdateDto;
import com.venturelens.security.UserPrincipal;
import com.venturelens.service.MeetingRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meeting")
@CrossOrigin(origins = "*")
public class MeetingRequestController {

    private final MeetingRequestService meetingRequestService;

    public MeetingRequestController(MeetingRequestService meetingRequestService) {
        this.meetingRequestService = meetingRequestService;
    }

    @PostMapping("/create")
    public ResponseEntity<MeetingResponseDto> createMeeting(
        @Valid @RequestBody MeetingRequestCreateDto req,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(meetingRequestService.createMeetingRequest(req, principal));
    }

    @GetMapping("/investor/{investorId}")
    public ResponseEntity<List<MeetingResponseDto>> getMeetingsForInvestor(
        @PathVariable Long investorId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(meetingRequestService.getMeetingsForInvestor(investorId, principal));
    }

    @GetMapping("/startup/{startupId}")
    public ResponseEntity<List<MeetingResponseDto>> getMeetingsForStartup(
        @PathVariable Long startupId,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(meetingRequestService.getMeetingsForStartup(startupId, principal));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<MeetingResponseDto> updateStatus(
        @PathVariable Long id,
        @Valid @RequestBody MeetingStatusUpdateDto req,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(meetingRequestService.updateMeetingStatus(id, req, principal));
    }
}
