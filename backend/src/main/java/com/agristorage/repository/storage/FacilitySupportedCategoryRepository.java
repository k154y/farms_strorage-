package com.agristorage.repository.storage;

import com.agristorage.entity.storage.FacilitySupportedCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FacilitySupportedCategoryRepository extends JpaRepository<FacilitySupportedCategory, Long> {

    List<FacilitySupportedCategory> findByFacilityId(Long facilityId);

    Optional<FacilitySupportedCategory> findByFacilityIdAndProduceCategoryId(Long facilityId, Long produceCategoryId);
}