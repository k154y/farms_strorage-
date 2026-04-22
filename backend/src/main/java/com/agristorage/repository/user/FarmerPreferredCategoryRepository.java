package com.agristorage.repository.user;

import com.agristorage.entity.user.FarmerPreferredCategory;
import com.agristorage.entity.user.FarmerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FarmerPreferredCategoryRepository extends JpaRepository<FarmerPreferredCategory, Long> {

    List<FarmerPreferredCategory> findByFarmerProfileId(Long farmerProfileId);

    void deleteByFarmerProfile(FarmerProfile farmerProfile);
}
