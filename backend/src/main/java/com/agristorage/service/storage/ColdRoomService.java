package com.agristorage.service.storage;

import com.agristorage.dto.request.CreateColdRoomRequest;
import com.agristorage.dto.request.UpdateColdRoomRequest;
import com.agristorage.entity.storage.ColdRoom;
import com.agristorage.entity.storage.ColdRoomSupportedCategory;
import com.agristorage.entity.storage.ProduceCategory;
import com.agristorage.entity.storage.StorageFacility;
import com.agristorage.repository.storage.ColdRoomRepository;
import com.agristorage.repository.storage.ColdRoomSupportedCategoryRepository;
import com.agristorage.repository.storage.ProduceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ColdRoomService {

    private final ColdRoomRepository coldRoomRepository;
    private final StorageFacilityService storageFacilityService;
    private final ProduceCategoryRepository produceCategoryRepository;
    private final ColdRoomSupportedCategoryRepository coldRoomSupportedCategoryRepository;

    public ColdRoom createColdRoom(CreateColdRoomRequest request) {
        StorageFacility facility = storageFacilityService.getFacilityById(request.getFacilityId());

        if (request.getAvailableCapacity() > request.getTotalCapacity()) {
            throw new RuntimeException("Available capacity cannot be greater than total capacity");
        }

        ColdRoom coldRoom = ColdRoom.builder()
                .facility(facility)
                .code(request.getCode())
                .name(request.getName())
                .totalCapacity(request.getTotalCapacity())
                .availableCapacity(request.getAvailableCapacity())
                .minTemperature(request.getMinTemperature())
                .maxTemperature(request.getMaxTemperature())
                .pricingType(request.getPricingType())
                .pricePerUnit(request.getPricePerUnit())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        ColdRoom savedColdRoom = coldRoomRepository.save(coldRoom);
        syncSupportedCategories(savedColdRoom, request.getSupportedCategoryIds());
        return attachSupportedCategories(savedColdRoom);
    }

    public List<ColdRoom> getAllColdRooms() {
        return attachSupportedCategories(coldRoomRepository.findAll());
    }

    public ColdRoom getColdRoomById(Long id) {
        ColdRoom coldRoom = coldRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cold room not found with id: " + id));
        return attachSupportedCategories(coldRoom);
    }

    public ColdRoom updateColdRoom(Long id, UpdateColdRoomRequest request) {
        ColdRoom coldRoom = getColdRoomById(id);

        if (request.getAvailableCapacity() > request.getTotalCapacity()) {
            throw new RuntimeException("Available capacity cannot be greater than total capacity");
        }

        coldRoom.setCode(request.getCode());
        coldRoom.setName(request.getName());
        coldRoom.setTotalCapacity(request.getTotalCapacity());
        coldRoom.setAvailableCapacity(request.getAvailableCapacity());
        coldRoom.setMinTemperature(request.getMinTemperature());
        coldRoom.setMaxTemperature(request.getMaxTemperature());
        coldRoom.setPricingType(request.getPricingType());
        coldRoom.setPricePerUnit(request.getPricePerUnit());

        if (request.getActive() != null) {
            coldRoom.setActive(request.getActive());
        }

        ColdRoom updatedColdRoom = coldRoomRepository.save(coldRoom);
        syncSupportedCategories(updatedColdRoom, request.getSupportedCategoryIds());
        return attachSupportedCategories(updatedColdRoom);
    }

    public void deleteColdRoom(Long id) {
        ColdRoom coldRoom = getColdRoomById(id);
        coldRoomRepository.delete(coldRoom);
    }

    public ColdRoomSupportedCategory addSupportedCategory(Long coldRoomId, Long categoryId) {
        ColdRoom coldRoom = getColdRoomById(coldRoomId);

        ProduceCategory category = produceCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Produce category not found with id: " + categoryId));

        coldRoomSupportedCategoryRepository.findByColdRoomIdAndProduceCategoryId(coldRoomId, categoryId)
                .ifPresent(existing -> {
                    throw new RuntimeException("Category already assigned to this cold room");
                });

        ColdRoomSupportedCategory supportedCategory = ColdRoomSupportedCategory.builder()
                .coldRoom(coldRoom)
                .produceCategory(category)
                .build();

        return coldRoomSupportedCategoryRepository.save(supportedCategory);
    }

    public List<ColdRoomSupportedCategory> getColdRoomSupportedCategories(Long coldRoomId) {
        getColdRoomById(coldRoomId);
        return coldRoomSupportedCategoryRepository.findByColdRoomId(coldRoomId);
    }

    private void syncSupportedCategories(ColdRoom coldRoom, List<Long> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            coldRoomSupportedCategoryRepository.deleteByColdRoomId(coldRoom.getId());
            coldRoom.setSupportedCategories(Collections.emptyList());
            return;
        }

        List<Long> uniqueCategoryIds = new ArrayList<>(new LinkedHashSet<>(categoryIds));
        List<ProduceCategory> categories = produceCategoryRepository.findAllById(uniqueCategoryIds);

        if (categories.size() != uniqueCategoryIds.size()) {
            throw new RuntimeException("One or more selected produce categories were not found");
        }

        coldRoomSupportedCategoryRepository.deleteByColdRoomId(coldRoom.getId());

        List<ColdRoomSupportedCategory> supportedCategories = categories.stream()
                .map(category -> ColdRoomSupportedCategory.builder()
                        .coldRoom(coldRoom)
                        .produceCategory(category)
                        .build())
                .toList();

        coldRoomSupportedCategoryRepository.saveAll(supportedCategories);
        coldRoom.setSupportedCategories(categories);
    }

    private List<ColdRoom> attachSupportedCategories(List<ColdRoom> coldRooms) {
        if (coldRooms == null || coldRooms.isEmpty()) {
            return coldRooms;
        }

        List<Long> coldRoomIds = coldRooms.stream()
                .map(ColdRoom::getId)
                .toList();

        Map<Long, List<ProduceCategory>> supportedCategoriesByRoomId =
                coldRoomSupportedCategoryRepository.findByColdRoomIdIn(coldRoomIds).stream()
                        .collect(Collectors.groupingBy(
                                item -> item.getColdRoom().getId(),
                                Collectors.mapping(ColdRoomSupportedCategory::getProduceCategory, Collectors.toList())
                        ));

        coldRooms.forEach(room -> room.setSupportedCategories(
                supportedCategoriesByRoomId.getOrDefault(room.getId(), Collections.emptyList())
        ));

        return coldRooms;
    }

    private ColdRoom attachSupportedCategories(ColdRoom coldRoom) {
        if (coldRoom == null) {
            return null;
        }

        coldRoom.setSupportedCategories(
                coldRoomSupportedCategoryRepository.findByColdRoomId(coldRoom.getId()).stream()
                        .map(ColdRoomSupportedCategory::getProduceCategory)
                        .toList()
        );

        return coldRoom;
    }
}
