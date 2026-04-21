package com.agristorage.controller.storage;

import com.agristorage.dto.request.CreateColdRoomRequest;
import com.agristorage.dto.request.UpdateColdRoomRequest;
import com.agristorage.entity.storage.ColdRoom;
import com.agristorage.entity.storage.ColdRoomSupportedCategory;
import com.agristorage.service.storage.ColdRoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storage/cold-rooms")
@RequiredArgsConstructor
public class ColdRoomController {

    private final ColdRoomService coldRoomService;

    @PostMapping
    public ColdRoom createColdRoom(@Valid @RequestBody CreateColdRoomRequest request) {
        return coldRoomService.createColdRoom(request);
    }

    @GetMapping
    public List<ColdRoom> getAllColdRooms() {
        return coldRoomService.getAllColdRooms();
    }

    @GetMapping("/{id}")
    public ColdRoom getColdRoomById(@PathVariable Long id) {
        return coldRoomService.getColdRoomById(id);
    }

    @PutMapping("/{id}")
    public ColdRoom updateColdRoom(@PathVariable Long id,
                                   @Valid @RequestBody UpdateColdRoomRequest request) {
        return coldRoomService.updateColdRoom(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteColdRoom(@PathVariable Long id) {
        coldRoomService.deleteColdRoom(id);
        return "Cold room deleted successfully";
    }

    @PostMapping("/{coldRoomId}/categories/{categoryId}")
    public ColdRoomSupportedCategory addSupportedCategory(@PathVariable Long coldRoomId,
                                                          @PathVariable Long categoryId) {
        return coldRoomService.addSupportedCategory(coldRoomId, categoryId);
    }

    @GetMapping("/{coldRoomId}/categories")
    public List<ColdRoomSupportedCategory> getSupportedCategories(@PathVariable Long coldRoomId) {
        return coldRoomService.getColdRoomSupportedCategories(coldRoomId);
    }
}