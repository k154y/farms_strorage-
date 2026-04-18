package com.agristorage.controller.storage;

import com.agristorage.dto.request.CreateProduceCategoryRequest;
import com.agristorage.dto.request.UpdateProduceCategoryRequest;
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
    public ProduceCategory createCategory(@Valid @RequestBody CreateProduceCategoryRequest request) {
        return produceCategoryService.createCategory(request);
    }

    @GetMapping
    public List<ProduceCategory> getAllCategories() {
        return produceCategoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public ProduceCategory getCategoryById(@PathVariable Long id) {
        return produceCategoryService.getCategoryById(id);
    }

    @PutMapping("/{id}")
    public ProduceCategory updateCategory(@PathVariable Long id,
                                          @Valid @RequestBody UpdateProduceCategoryRequest request) {
        return produceCategoryService.updateCategory(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable Long id) {
        produceCategoryService.deleteCategory(id);
        return "Produce category deleted successfully";
    }
}