package com.eventhub.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryRequest {


    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 50,
            message = "Category name must be between 2 and 50 characters")
    private String name;

    public @NotBlank(message = "Category name is required") @Size(min = 2, max = 50,
            message = "Category name must be between 2 and 50 characters") String getName() {
        return name;
    }

    public void setName(@NotBlank(message = "Category name is required") @Size(min = 2, max = 50,
            message = "Category name must be between 2 and 50 characters") String name) {
        this.name = name;
    }
}