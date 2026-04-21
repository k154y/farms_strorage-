package com.agristorage.service.user;

import com.agristorage.entity.user.User;
import com.agristorage.entity.user.VerificationDocument;
import com.agristorage.enums.DocumentType;
import com.agristorage.enums.VerificationStatus;
import com.agristorage.repository.user.UserRepository;
import com.agristorage.repository.user.VerificationDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VerificationDocumentService {

    private final VerificationDocumentRepository documentRepository;
    private final UserRepository userRepository;

    // Save document metadata (upload file and save metadata)
    public VerificationDocument saveDocumentMetadata(MultipartFile file, Long userId, DocumentType type) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        VerificationDocument doc = new VerificationDocument();
        doc.setUser(user);
        doc.setDocumentType(type);
        doc.setFileName(file.getOriginalFilename());
        doc.setFilePath("cloudinary-url-placeholder"); // Replace with actual Cloudinary URL
        doc.setMimeType(file.getContentType());
        doc.setFileSize(file.getSize());
        doc.setStatus(VerificationStatus.PENDING);
        return documentRepository.save(doc);
    }

    // List user documents
    public List<VerificationDocument> listUserDocuments(Long userId) {
        return documentRepository.findByUserId(userId);
    }

    // Review document status (approve/reject)
    public VerificationDocument reviewDocumentStatus(Long docId, VerificationStatus status, String comment) {
        VerificationDocument doc = documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        doc.setStatus(status);
        doc.setComment(comment);
        return documentRepository.save(doc);
    }

    // Helper method to get userId by email
    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }
}