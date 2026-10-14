package com.eventhub.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class CreateEventRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100,
            message = "Title must be between 3 and 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 1000,
            message = "Description must be between 10 and 1000 characters")
    private String description;

    @NotBlank(message = "Location is required")
    @Size(min = 2, max = 100,
            message = "Location must be between 2 and 100 characters")
    private String location;

    @Future(message = "Event date must be in the future")
    private LocalDateTime date;

    @Min(value = 1,
            message = "Capacity must be at least 1")
    private int capacity;

    private Long categoryId;

    private String category;

    @Size(max = 50,
            message = "Category name cannot exceed 50 characters")
    private String newCategory;

    // getters & setters


    public @NotBlank(message = "Title is required") @Size(min = 3, max = 100,
            message = "Title must be between 3 and 100 characters") String getTitle() {
        return title;
    }

    public void setTitle(@NotBlank(message = "Title is required") @Size(min = 3, max = 100,
            message = "Title must be between 3 and 100 characters") String title) {
        this.title = title;
    }

    public @NotBlank(message = "Description is required") @Size(min = 10, max = 1000,
            message = "Description must be between 10 and 1000 characters") String getDescription() {
        return description;
    }

    public void setDescription(@NotBlank(message = "Description is required") @Size(min = 10, max = 1000,
            message = "Description must be between 10 and 1000 characters") String description) {
        this.description = description;
    }

    public @NotBlank(message = "Location is required") @Size(min = 2, max = 100,
            message = "Location must be between 2 and 100 characters") String getLocation() {
        return location;
    }

    public void setLocation(@NotBlank(message = "Location is required") @Size(min = 2, max = 100,
            message = "Location must be between 2 and 100 characters") String location) {
        this.location = location;
    }

    public @Future(message = "Event date must be in the future") LocalDateTime getDate() {
        return date;
    }

    public void setDate(@Future(message = "Event date must be in the future") LocalDateTime date) {
        this.date = date;
    }

    @Min(value = 1,
            message = "Capacity must be at least 1")
    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(@Min(value = 1,
            message = "Capacity must be at least 1") int capacity) {
        this.capacity = capacity;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public @Size(max = 50,
            message = "Category name cannot exceed 50 characters") String getNewCategory() {
        return newCategory;
    }

    public void setNewCategory(@Size(max = 50,
            message = "Category name cannot exceed 50 characters") String newCategory) {
        this.newCategory = newCategory;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}