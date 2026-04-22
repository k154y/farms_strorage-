package com.agristorage.repository.user;

import com.agristorage.entity.user.FarmerFarmLocation;
import com.agristorage.entity.user.FarmerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FarmerFarmLocationRepository extends JpaRepository<FarmerFarmLocation, Long> {

    List<FarmerFarmLocation> findByFarmerProfileId(Long farmerProfileId);

    List<FarmerFarmLocation> findByFarmerProfile(FarmerProfile farmerProfile);
}
