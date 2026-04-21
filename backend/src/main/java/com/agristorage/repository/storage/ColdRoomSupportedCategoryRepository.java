package com.agristorage.repository.storage;

import com.agristorage.entity.storage.ColdRoomSupportedCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ColdRoomSupportedCategoryRepository extends JpaRepository<ColdRoomSupportedCategory, Long> {

    List<ColdRoomSupportedCategory> findByColdRoomId(Long coldRoomId);

    Optional<ColdRoomSupportedCategory> findByColdRoomIdAndProduceCategoryId(Long coldRoomId, Long produceCategoryId);
}