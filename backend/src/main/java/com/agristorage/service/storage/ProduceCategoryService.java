package com.agristorage.service.storage;

import com.agristorage.dto.request.CreateProduceCategoryRequest;
import com.agristorage.dto.request.UpdateProduceCategoryRequest;
import com.agristorage.entity.storage.ProduceCategory;
import com.agristorage.exception.ConflictException;
import com.agristorage.exception.ResourceNotFoundException;
import com.agristorage.repository.storage.ProduceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProduceCategoryService {

    private final ProduceCategoryRepository produceCategoryRepository;

    public ProduceCategory createCategory(CreateProduceCategoryRequest request) {
        produceCategoryRepository.findByName(request.getName()).ifPresent(category -> {
            throw new ConflictException("Produce category with this name already exists");
        });

        ProduceCategory category = ProduceCategory.builder()
                .name(request.getName())
                .description(request.getDescription())
                .recommendedMinTemperature(request.getRecommendedMinTemperature())
                .recommendedMaxTemperature(request.getRecommendedMaxTemperature())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        return produceCategoryRepository.save(category);
    }

    public List<ProduceCategory> getAllCategories() {
        return produceCategoryRepository.findAll();
    }

    public ProduceCategory getCategoryById(Long id) {
        return produceCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produce category not found with id: " + id));
    }

    public ProduceCategory updateCategory(Long id, UpdateProduceCategoryRequest request) {
        ProduceCategory category = getCategoryById(id);

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setRecommendedMinTemperature(request.getRecommendedMinTemperature());
        category.setRecommendedMaxTemperature(request.getRecommendedMaxTemperature());
        category.setActive(request.getActive() != null ? request.getActive() : category.isActive());

        return produceCategoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        ProduceCategory category = getCategoryById(id);
        produceCategoryRepository.delete(category);
    }
}