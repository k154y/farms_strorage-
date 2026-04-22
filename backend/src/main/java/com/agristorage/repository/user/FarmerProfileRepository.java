package com.agristorage.repository.user;

import com.agristorage.entity.user.FarmerProfile;
import com.agristorage.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FarmerProfileRepository extends JpaRepository<FarmerProfile, Long> {
    Optional<FarmerProfile> findByUser(User user);
}
