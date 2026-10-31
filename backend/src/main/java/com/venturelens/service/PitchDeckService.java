package com.venturelens.service;

import com.venturelens.dto.PitchDeckDto;
import com.venturelens.entity.PitchDeck;
import com.venturelens.entity.Startup;
import com.venturelens.repository.PitchDeckRepository;
import com.venturelens.repository.StartupRepository;
import com.venturelens.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class PitchDeckService {

    private final PitchDeckRepository pitchDeckRepository;
    private final StartupRepository startupRepository;
    private final Path fileStorageLocation;

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "ppt", "pptx");
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/octet-stream"
    );
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    public PitchDeckService(
        PitchDeckRepository pitchDeckRepository,
        StartupRepository startupRepository,
        @Value("${venturelens.upload.dir:./uploads/pitch_decks}") String uploadDir
    ) {
        this.pitchDeckRepository = pitchDeckRepository;
        this.startupRepository = startupRepository;
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Transactional
    public PitchDeckDto uploadPitchDeck(Long startupId, MultipartFile file, UserPrincipal principal) throws IOException {
        if (!principal.getRole().equalsIgnoreCase("ADMIN") && !principal.getUserId().equals(startupId)) {
            throw new AccessDeniedException("You are not authorized to upload pitch decks for this startup");
        }

        Startup startup = startupRepository.findById(startupId)
            .orElseThrow(() -> new IllegalArgumentException("Startup not found with id: " + startupId));

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum allowed limit of 50 MB");
        }

        String rawOriginalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileExtension = "";
        int dotIndex = rawOriginalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            fileExtension = rawOriginalFilename.substring(dotIndex + 1).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(fileExtension)) {
            throw new IllegalArgumentException("Invalid file format. Only PDF, PPT, and PPTX files are supported.");
        }

        String storedFileName = "startup_" + startupId + "_" + UUID.randomUUID() + "." + fileExtension;
        Path targetLocation = this.fileStorageLocation.resolve(storedFileName);

        // Delete old file if replacing
        Optional<PitchDeck> existingOpt = pitchDeckRepository.findByStartupId(startupId);
        PitchDeck pitchDeck;

        if (existingOpt.isPresent()) {
            pitchDeck = existingOpt.get();
            try {
                Path oldPath = Paths.get(pitchDeck.getStoragePath());
                Files.deleteIfExists(oldPath);
            } catch (Exception ignored) {
            }
            pitchDeck.setOriginalFileName(rawOriginalFilename);
            pitchDeck.setFileType(file.getContentType() != null ? file.getContentType() : "application/" + fileExtension);
            pitchDeck.setFileSize(file.getSize());
            pitchDeck.setStoragePath(targetLocation.toString());
            pitchDeck.setUploadedAt(LocalDateTime.now());
        } else {
            pitchDeck = new PitchDeck(
                startup,
                rawOriginalFilename,
                file.getContentType() != null ? file.getContentType() : "application/" + fileExtension,
                file.getSize(),
                targetLocation.toString()
            );
        }

        // Copy new file
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        PitchDeck saved = pitchDeckRepository.save(pitchDeck);
        return mapToDto(saved);
    }

    public PitchDeckDto getPitchDeckInfo(Long startupId) {
        PitchDeck pitchDeck = pitchDeckRepository.findByStartupId(startupId)
            .orElseThrow(() -> new IllegalArgumentException("No pitch deck found for startup id: " + startupId));
        return mapToDto(pitchDeck);
    }

    public Resource loadFileAsResource(Long startupId) {
        PitchDeck pitchDeck = pitchDeckRepository.findByStartupId(startupId)
            .orElseThrow(() -> new IllegalArgumentException("No pitch deck found for startup id: " + startupId));

        try {
            Path filePath = Paths.get(pitchDeck.getStoragePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found on storage: " + pitchDeck.getOriginalFileName());
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File path is invalid: " + pitchDeck.getOriginalFileName(), ex);
        }
    }

    public PitchDeck mapEntity(Long startupId) {
        return pitchDeckRepository.findByStartupId(startupId)
            .orElseThrow(() -> new IllegalArgumentException("No pitch deck found for startup id: " + startupId));
    }

    public PitchDeckDto mapToDto(PitchDeck p) {
        return new PitchDeckDto(
            p.getId(),
            p.getStartup().getId(),
            p.getStartup().getCompanyName(),
            p.getOriginalFileName(),
            p.getFileType(),
            p.getFileSize(),
            p.getUploadedAt()
        );
    }
}
