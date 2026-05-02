package com.agristorage.repository.user;

import com.agristorage.entity.user.StorageManagerProfile;
import com.agristorage.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StorageManagerProfileRepository extends JpaRepository<StorageManagerProfile, Long> {
    Optional<StorageManagerProfile> findByUser(User user);
}
