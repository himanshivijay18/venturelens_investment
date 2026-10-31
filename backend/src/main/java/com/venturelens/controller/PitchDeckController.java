package com.venturelens.controller;

import com.venturelens.dto.PitchDeckDto;
import com.venturelens.entity.PitchDeck;
import com.venturelens.security.UserPrincipal;
import com.venturelens.service.PitchDeckService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/pitch-deck")
@CrossOrigin(origins = "*")
public class PitchDeckController {

    private final PitchDeckService pitchDeckService;

    public PitchDeckController(PitchDeckService pitchDeckService) {
        this.pitchDeckService = pitchDeckService;
    }

    @PostMapping("/upload/{startupId}")
    public ResponseEntity<PitchDeckDto> uploadPitchDeck(
        @PathVariable Long startupId,
        @RequestParam("file") MultipartFile file,
        @AuthenticationPrincipal UserPrincipal principal
    ) throws IOException {
        PitchDeckDto dto = pitchDeckService.uploadPitchDeck(startupId, file, principal);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{startupId}")
    public ResponseEntity<PitchDeckDto> getPitchDeckInfo(@PathVariable Long startupId) {
        PitchDeckDto dto = pitchDeckService.getPitchDeckInfo(startupId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/download/{startupId}")
    public ResponseEntity<Resource> downloadPitchDeck(@PathVariable Long startupId) {
        PitchDeck deck = pitchDeckService.mapEntity(startupId);
        Resource resource = pitchDeckService.loadFileAsResource(startupId);

        String contentType = deck.getFileType();
        if (contentType == null || contentType.isBlank()) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + deck.getOriginalFileName() + "\"")
            .body(resource);
    }
}
