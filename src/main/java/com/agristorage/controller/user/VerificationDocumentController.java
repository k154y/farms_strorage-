package com.agristorage.controller.user;

import com.agristorage.entity.user.VerificationDocument;
import com.agristorage.enums.DocumentType;
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
                                               @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        Long userId = getUserId(userDetails);
        return documentService.uploadDocument(file, userId, type);
    }

    @GetMapping("/my")
    public List<VerificationDocument> getMyDocuments(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return documentService.getUserDocuments(userId);
    }

    private Long getUserId(UserDetails userDetails) {
        return documentService.getUserIdByEmail(userDetails.getUsername());
    }
}