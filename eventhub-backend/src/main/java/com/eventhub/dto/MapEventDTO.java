package com.eventhub.dto;

public class MapEventDTO {
    private Long id;
    private String title;
    private String location;

    public MapEventDTO(Long id, String title, String location) {
        this.id = id;
        this.title = title;
        this.location = location;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getLocation() {
        return location;
    }
}
