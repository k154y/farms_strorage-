package com.agristorage.repository.user;

import com.agristorage.entity.user.TransporterProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransporterProfileRepository extends JpaRepository<TransporterProfile, Long> {
}