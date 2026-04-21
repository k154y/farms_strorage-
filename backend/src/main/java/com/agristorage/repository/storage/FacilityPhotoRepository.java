package com.agristorage.repository.storage;

import com.agristorage.entity.storage.FacilityPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FacilityPhotoRepository extends JpaRepository<FacilityPhoto, Long> {

    List<FacilityPhoto> findByFacilityId(Long facilityId);
}