package com.agristorage.controller.storage;

import com.agristorage.dto.request.CreateStorageFacilityRequest;
import com.agristorage.dto.request.UpdateStorageFacilityRequest;
import com.agristorage.entity.storage.FacilitySupportedCategory;
import com.agristorage.entity.storage.StorageFacility;
import com.agristorage.service.storage.StorageFacilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storage/facilities")
@RequiredArgsConstructor
public class StorageFacilityController {

    private final StorageFacilityService storageFacilityService;

    @PostMapping
    public StorageFacility createFacility(@Valid @RequestBody CreateStorageFacilityRequest request) {
        return storageFacilityService.createFacility(request);
    }

    @GetMapping
    public List<StorageFacility> getAllFacilities() {
        return storageFacilityService.getAllFacilities();
    }

    @GetMapping("/{id}")
    public StorageFacility getFacilityById(@PathVariable Long id) {
        return storageFacilityService.getFacilityById(id);
    }

    @PutMapping("/{id}")
    public StorageFacility updateFacility(@PathVariable Long id,
                                          @Valid @RequestBody UpdateStorageFacilityRequest request) {
        return storageFacilityService.updateFacility(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteFacility(@PathVariable Long id) {
        storageFacilityService.deleteFacility(id);
        return "Storage facility deleted successfully";
    }

    @PostMapping("/{facilityId}/categories/{categoryId}")
    public FacilitySupportedCategory addSupportedCategory(@PathVariable Long facilityId,
                                                          @PathVariable Long categoryId) {
        return storageFacilityService.addSupportedCategory(facilityId, categoryId);
    }

    @GetMapping("/{facilityId}/categories")
    public List<FacilitySupportedCategory> getSupportedCategories(@PathVariable Long facilityId) {
        return storageFacilityService.getFacilitySupportedCategories(facilityId);
    }
}