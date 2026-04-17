package com.agristorage.repository.storage;

import com.agristorage.entity.storage.ColdRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColdRoomRepository extends JpaRepository<ColdRoom, Long> {
}