package com.agristorage.service.storage;

import com.agristorage.entity.storage.FacilityPhoto;
import com.agristorage.entity.storage.StorageFacility;
import com.agristorage.repository.storage.FacilityPhotoRepository;
import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FacilityPhotoService {

    private final Cloudinary cloudinary;
    private final FacilityPhotoRepository facilityPhotoRepository;
    private final StorageFacilityService storageFacilityService;

    public FacilityPhoto uploadFacilityPhoto(Long facilityId, MultipartFile file) throws IOException {
        StorageFacility facility = storageFacilityService.getFacilityById(facilityId);
        List<FacilityPhoto> existingPhotos = facilityPhotoRepository.findByFacilityId(facilityId);

        for (FacilityPhoto existingPhoto : existingPhotos) {
            deleteCloudinaryAsset(existingPhoto.getFilePath());
        }
        facilityPhotoRepository.deleteAll(existingPhotos);

        Map<String, Object> uploadOptions = new HashMap<>();
        uploadOptions.put("folder", "agri-storage-system/facility-photos");
        uploadOptions.put("resource_type", "image");
        uploadOptions.put("public_id", "facility-" + facilityId + "-" + System.currentTimeMillis());

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);
        Object secureUrl = uploadResult.get("secure_url");

        FacilityPhoto photo = FacilityPhoto.builder()
                .facility(facility)
                .fileName(file.getOriginalFilename())
                .filePath(secureUrl != null ? secureUrl.toString() : null)
                .build();

        return facilityPhotoRepository.save(photo);
    }

    public List<FacilityPhoto> getFacilityPhotos(Long facilityId) {
        storageFacilityService.getFacilityById(facilityId);
        return facilityPhotoRepository.findByFacilityId(facilityId);
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
            cloudinary.uploader().destroy(publicId, new HashMap<>(Collections.singletonMap("resource_type", "image")));
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
