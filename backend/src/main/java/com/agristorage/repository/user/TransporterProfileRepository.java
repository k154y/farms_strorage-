package com.agristorage.repository.user;

import com.agristorage.entity.user.TransporterProfile;
import com.agristorage.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransporterProfileRepository extends JpaRepository<TransporterProfile, Long> {
    Optional<TransporterProfile> findByUser(User user);
}
