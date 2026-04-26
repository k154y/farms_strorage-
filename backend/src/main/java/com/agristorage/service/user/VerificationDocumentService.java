package com.agristorage.service.user;

import com.cloudinary.Cloudinary;
import com.agristorage.service.common.AuditLogService;
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
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VerificationDocumentService {

    private final Cloudinary cloudinary;
    private final VerificationDocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    // Save document metadata (upload file and save metadata)
    public VerificationDocument saveDocumentMetadata(MultipartFile file, Long userId, DocumentType type) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> uploadOptions = new HashMap<>();
        uploadOptions.put("folder", "agri-storage-system/verification-documents");
        uploadOptions.put("resource_type", "auto");
        uploadOptions.put("public_id", "user-" + userId + "-" + System.currentTimeMillis() + "-" + type.name().toLowerCase());

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);
        Object secureUrl = uploadResult.get("secure_url");

        VerificationDocument doc = new VerificationDocument();
        doc.setUser(user);
        doc.setDocumentType(type);
        doc.setFileName(file.getOriginalFilename());
        doc.setFilePath(secureUrl != null ? secureUrl.toString() : null);
        doc.setMimeType(file.getContentType());
        doc.setFileSize(file.getSize());
        doc.setStatus(VerificationStatus.PENDING);
        VerificationDocument saved = documentRepository.save(doc);

        notificationService.notifyAdmins(
                "New Verification Document",
                user.getFullName() + " uploaded " + type.name() + " for review.",
                "GENERAL"
        );
        auditLogService.log(user.getId(), "DOCUMENT_UPLOADED", "VERIFICATION_DOCUMENT", saved.getId(), "Uploaded " + type.name());

        return saved;
    }

    // List user documents
    public List<VerificationDocument> listUserDocuments(Long userId) {
        return documentRepository.findByUserId(userId);
    }

    public VerificationDocument uploadDocument(MultipartFile file, Long userId, DocumentType type) throws IOException {
        return saveDocumentMetadata(file, userId, type);
    }

    public List<VerificationDocument> getUserDocuments(Long userId) {
        return listUserDocuments(userId);
    }

    public List<VerificationDocument> getAllDocuments() {
        return documentRepository.findAll();
    }

    // Review document status (approve/reject)
    public VerificationDocument reviewDocumentStatus(Long docId, VerificationStatus status, String comment) {
        VerificationDocument doc = documentRepository.findById(docId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        String reviewComment = comment != null ? comment.trim() : "";

        if (status == VerificationStatus.REJECTED) {
            String rejectionReason = reviewComment.isBlank()
                    ? "No specific reason was added."
                    : reviewComment;

            deleteCloudinaryAsset(doc.getFilePath());
            documentRepository.delete(doc);
            notificationService.createNotification(
                    doc.getUser().getId(),
                    "Document Rejected",
                    "Your document " + doc.getDocumentType() + " was rejected and removed. Reason: "
                            + rejectionReason + " Please upload a new one.",
                    "DOCUMENT_REJECTED"
            );
            auditLogService.log(doc.getUser().getId(), "DOCUMENT_REJECTED", "VERIFICATION_DOCUMENT", doc.getId(), rejectionReason);
            return doc;
        }

        doc.setStatus(status);
        doc.setComment(reviewComment.isBlank() ? null : reviewComment);
        doc.setReviewedAt(LocalDateTime.now());
        VerificationDocument saved = documentRepository.save(doc);
        auditLogService.log(doc.getUser().getId(), "DOCUMENT_" + status.name(), "VERIFICATION_DOCUMENT", doc.getId(), reviewComment);
        return saved;
    }

    // Helper method to get userId by email
    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found")).getId();
    }

    public VerificationDocument reviewDocument(Long docId, VerificationStatus status, String comment) {
        return reviewDocumentStatus(docId, status, comment);
    }

    private void deleteCloudinaryAsset(String filePath) {
        String publicId = extractPublicId(filePath);

        if (publicId == null) {
            return;
        }

        try {
            cloudinary.uploader().destroy(publicId, new HashMap<>());
        } catch (Exception ignored) {
        }

        try {
            cloudinary.uploader().destroy(publicId, new HashMap<>(Collections.singletonMap("resource_type", "raw")));
        } catch (Exception ignored) {
        }
    }

    private String extractPublicId(String filePath) {
        if (filePath == null || !filePath.contains("/upload/")) {
            return null;
        }

        String afterUpload = filePath.substring(filePath.indexOf("/upload/") + "/upload/".length());
        afterUpload = afterUpload.replaceFirst("^v\\d+/", "");

        int extensionIndex = afterUpload.lastIndexOf('.');
        if (extensionIndex > 0) {
            afterUpload = afterUpload.substring(0, extensionIndex);
        }

        return afterUpload;
    }
}
