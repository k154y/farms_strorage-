package com.agristorage.repository.storage;

import com.agristorage.entity.storage.StorageFacility;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StorageFacilityRepository extends JpaRepository<StorageFacility, Long> {
}