package com.agristorage.repository.storage;

import com.agristorage.entity.storage.ProduceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProduceCategoryRepository extends JpaRepository<ProduceCategory, Long> {
    Optional<ProduceCategory> findByName(String name);
    Optional<ProduceCategory> findByNameIgnoreCase(String name);
}
