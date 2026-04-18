package com.agristorage.controller.storage;

import com.agristorage.dto.request.CreateProduceCategoryRequest;
import com.agristorage.dto.request.UpdateProduceCategoryRequest;
import com.agristorage.dto.response.ApiResponse;
import com.agristorage.entity.storage.ProduceCategory;
import com.agristorage.service.storage.ProduceCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storage/categories")
@RequiredArgsConstructor
public class ProduceCategoryController {

    private final ProduceCategoryService produceCategoryService;

    @PostMapping
    public ApiResponse<ProduceCategory> createCategory(@Valid @RequestBody CreateProduceCategoryRequest request) {
        return new ApiResponse<>(true, "Produce category created successfully",
                produceCategoryService.createCategory(request));
    }

    @GetMapping
    public ApiResponse<List<ProduceCategory>> getAllCategories() {
        return new ApiResponse<>(true, "Produce categories fetched successfully",
                produceCategoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ApiResponse<ProduceCategory> getCategoryById(@PathVariable Long id) {
        return new ApiResponse<>(true, "Produce category fetched successfully",
                produceCategoryService.getCategoryById(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<ProduceCategory> updateCategory(@PathVariable Long id,
                                                       @Valid @RequestBody UpdateProduceCategoryRequest request) {
        return new ApiResponse<>(true, "Produce category updated successfully",
                produceCategoryService.updateCategory(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteCategory(@PathVariable Long id) {
        produceCategoryService.deleteCategory(id);
        return new ApiResponse<>(true, "Produce category deleted successfully", null);
    }
}