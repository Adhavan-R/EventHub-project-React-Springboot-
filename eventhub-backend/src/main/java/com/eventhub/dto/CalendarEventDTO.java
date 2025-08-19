package com.eventhub.dto;

import java.time.LocalDateTime;

public class CalendarEventDTO {
    private Long id;
    private String title;
    private LocalDateTime date;

    public CalendarEventDTO(Long id, String title, LocalDateTime date) {
        this.id = id;
        this.title = title;
        this.date = date;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public LocalDateTime getDate() {
        return date;
    }
}
