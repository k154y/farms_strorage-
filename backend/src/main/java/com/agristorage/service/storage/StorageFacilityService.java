package com.agristorage.service.storage;

import com.agristorage.dto.request.CreateStorageFacilityRequest;
import com.agristorage.dto.request.UpdateStorageFacilityRequest;
import com.agristorage.entity.storage.FacilitySupportedCategory;
import com.agristorage.entity.storage.ProduceCategory;
import com.agristorage.entity.storage.StorageFacility;
import com.agristorage.entity.user.User;
import com.agristorage.enums.Role;
import com.agristorage.repository.storage.FacilitySupportedCategoryRepository;
import com.agristorage.repository.storage.ProduceCategoryRepository;
import com.agristorage.repository.storage.StorageFacilityRepository;
import com.agristorage.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StorageFacilityService {

    private final StorageFacilityRepository storageFacilityRepository;
    private final UserRepository userRepository;
    private final ProduceCategoryRepository produceCategoryRepository;
    private final FacilitySupportedCategoryRepository facilitySupportedCategoryRepository;

    public StorageFacility createFacility(CreateStorageFacilityRequest request) {
        User manager = userRepository.findById(request.getManagerId())
                .orElseThrow(() -> new RuntimeException("Manager not found with id: " + request.getManagerId()));

        if (manager.getRole() != Role.STORAGE_MANAGER) {
            throw new RuntimeException("User is not a storage manager");
        }

        StorageFacility facility = StorageFacility.builder()
                .manager(manager)
                .name(request.getName())
                .district(request.getDistrict())
                .sector(request.getSector())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .description(request.getDescription())
                .contactPhone(request.getContactPhone())
                .contactEmail(request.getContactEmail())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        return storageFacilityRepository.save(facility);
    }

    public List<StorageFacility> getAllFacilities() {
        return storageFacilityRepository.findAll();
    }

    public StorageFacility getFacilityById(Long id) {
        return storageFacilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Storage facility not found with id: " + id));
    }

    public StorageFacility updateFacility(Long id, UpdateStorageFacilityRequest request) {
        StorageFacility facility = getFacilityById(id);

        facility.setName(request.getName());
        facility.setDistrict(request.getDistrict());
        facility.setSector(request.getSector());
        facility.setAddress(request.getAddress());
        facility.setLatitude(request.getLatitude());
        facility.setLongitude(request.getLongitude());
        facility.setDescription(request.getDescription());
        facility.setContactPhone(request.getContactPhone());
        facility.setContactEmail(request.getContactEmail());

        if (request.getActive() != null) {
            facility.setActive(request.getActive());
        }

        return storageFacilityRepository.save(facility);
    }

    public void deleteFacility(Long id) {
        StorageFacility facility = getFacilityById(id);
        storageFacilityRepository.delete(facility);
    }

    public FacilitySupportedCategory addSupportedCategory(Long facilityId, Long categoryId) {
        StorageFacility facility = getFacilityById(facilityId);

        ProduceCategory category = produceCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Produce category not found with id: " + categoryId));

        facilitySupportedCategoryRepository.findByFacilityIdAndProduceCategoryId(facilityId, categoryId)
                .ifPresent(existing -> {
                    throw new RuntimeException("Category already assigned to this facility");
                });

        FacilitySupportedCategory supportedCategory = FacilitySupportedCategory.builder()
                .facility(facility)
                .produceCategory(category)
                .build();

        return facilitySupportedCategoryRepository.save(supportedCategory);
    }

    public List<FacilitySupportedCategory> getFacilitySupportedCategories(Long facilityId) {
        getFacilityById(facilityId);
        return facilitySupportedCategoryRepository.findByFacilityId(facilityId);
    }
}