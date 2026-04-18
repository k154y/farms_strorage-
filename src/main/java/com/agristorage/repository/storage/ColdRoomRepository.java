package com.agristorage.repository.storage;

import com.agristorage.entity.storage.ColdRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ColdRoomRepository extends JpaRepository<ColdRoom, Long> {

    List<ColdRoom> findByFacilityId(Long facilityId);

    Optional<ColdRoom> findByFacilityIdAndCode(Long facilityId, String code);
}