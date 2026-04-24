package com.agristorage.controller.storage;

import com.agristorage.entity.storage.FacilityPhoto;
import com.agristorage.service.storage.FacilityPhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/storage/facility-photos")
@RequiredArgsConstructor
public class FacilityPhotoController {

    private final FacilityPhotoService facilityPhotoService;

    @PostMapping("/upload")
    public FacilityPhoto uploadFacilityPhoto(@RequestParam Long facilityId,
                                             @RequestParam MultipartFile file) throws IOException {
        return facilityPhotoService.uploadFacilityPhoto(facilityId, file);
    }

    @GetMapping("/facility/{facilityId}")
    public List<FacilityPhoto> getFacilityPhotos(@PathVariable Long facilityId) {
        return facilityPhotoService.getFacilityPhotos(facilityId);
    }
}
