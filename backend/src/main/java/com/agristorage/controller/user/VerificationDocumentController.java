package com.agristorage.controller.user;

import com.agristorage.entity.user.VerificationDocument;
import com.agristorage.enums.DocumentType;
import com.agristorage.enums.VerificationStatus;
import com.agristorage.service.user.VerificationDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class VerificationDocumentController {

    private final VerificationDocumentService documentService;

    @PostMapping("/upload")
    public VerificationDocument uploadDocument(@RequestParam MultipartFile file,
                                               @RequestParam DocumentType type,
                                               @RequestParam(required = false) Long userId,
                                               @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        Long resolvedUserId = resolveUserId(userDetails, userId);
        return documentService.uploadDocument(file, resolvedUserId, type);
    }

    @GetMapping("/my")
    public List<VerificationDocument> getUserDocuments(@RequestParam(required = false) Long userId,
                                                       @AuthenticationPrincipal UserDetails userDetails) {
        Long resolvedUserId = resolveUserId(userDetails, userId);
        return documentService.getUserDocuments(resolvedUserId);
    }

    @GetMapping
    public List<VerificationDocument> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    @PatchMapping("/{docId}/review")
    public VerificationDocument reviewDocument(@PathVariable Long docId,
                                               @RequestParam VerificationStatus status,
                                               @RequestParam(required = false) String comment) {
        return documentService.reviewDocument(docId, status, comment);
    }

    private Long resolveUserId(UserDetails userDetails, Long fallbackUserId) {
        if (userDetails != null) {
            return documentService.getUserIdByEmail(userDetails.getUsername());
        }
        if (fallbackUserId != null) {
            return fallbackUserId;
        }
        throw new RuntimeException("User identity is required");
    }
}
