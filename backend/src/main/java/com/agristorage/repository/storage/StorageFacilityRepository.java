package com.agristorage.repository.storage;

import com.agristorage.entity.storage.StorageFacility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StorageFacilityRepository extends JpaRepository<StorageFacility, Long> {

    List<StorageFacility> findByManagerId(Long managerId);

    List<StorageFacility> findByDistrictIgnoreCase(String district);
}