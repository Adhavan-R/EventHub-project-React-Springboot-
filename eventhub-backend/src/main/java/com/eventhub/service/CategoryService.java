
package com.eventhub.service;

import com.eventhub.model.Category;
import com.eventhub.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));
    }

    public Category createCategory(String categoryName) {

        String normalizedName = normalizeName(categoryName);

        // Reuse an existing category if it already exists
        return categoryRepository.findByName(normalizedName)
                .orElseGet(() -> {
                    Category category = new Category();
                    category.setName(normalizedName);
                    return categoryRepository.save(category);
                });
    }

    public Category getCategoryByName(String name) {

        String normalizedName = normalizeName(name);

        return categoryRepository.findByName(normalizedName)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));
    }

    public Category getOrCreateCategory(String name) {

        String normalizedName = normalizeName(name);

        return categoryRepository.findByName(normalizedName)
                .orElseGet(() -> createCategory(normalizedName));
    }

    private String normalizeName(String name) {

        if (name == null || name.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Category is required"
            );
        }

        return name.trim().toUpperCase(Locale.ROOT);
    }
}
