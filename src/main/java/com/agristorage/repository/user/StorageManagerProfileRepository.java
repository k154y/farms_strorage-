package com.agristorage.repository.user;

import com.agristorage.entity.user.StorageManagerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StorageManagerProfileRepository extends JpaRepository<StorageManagerProfile, Long> {
}