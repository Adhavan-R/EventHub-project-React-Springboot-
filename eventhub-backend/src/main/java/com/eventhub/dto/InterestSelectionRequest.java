package com.eventhub.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public class InterestSelectionRequest {

    @NotEmpty(message = "Please select at least one category")
    @Size(min = 3,
            message = "Please select at least 3 interests")
    private List<Long> categoryIds;


    public List<Long> getCategoryIds() {
        return categoryIds;
    }

    public void setCategoryIds(List<Long> categoryIds) {
        this.categoryIds = categoryIds;
    }
}