package com.agristorage.repository.user;

import com.agristorage.entity.user.User;
import com.agristorage.entity.user.VerificationDocument;
import com.agristorage.enums.DocumentType;
import com.agristorage.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VerificationDocumentRepository extends JpaRepository<VerificationDocument, Long> {

    List<VerificationDocument> findByUser(User user);

    List<VerificationDocument> findByUserId(Long userId);

    List<VerificationDocument> findByStatus(VerificationStatus status);

    List<VerificationDocument> findByDocumentType(DocumentType documentType);

    List<VerificationDocument> findByUserIdAndStatus(Long userId, VerificationStatus status);
}