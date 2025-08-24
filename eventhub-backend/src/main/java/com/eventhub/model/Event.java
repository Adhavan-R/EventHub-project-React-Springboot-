package com.eventhub.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "events")
public class Event {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;
    private String location;

    @Column(nullable = false)

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime date;

    private int capacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User creator;

    @ManyToMany(mappedBy = "joinedEvents",fetch = FetchType.LAZY)
    @JsonIgnore  // Prevent circular reference
    private Set<User> attendees = new HashSet<>();

    @Column(nullable = false)
    private String category;

    @Column(name = "banner_url")
    private String bannerUrl;

    @Transient
    private int remainingSlots;


    public Event() {}

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public User getCreator() { return creator; }
    public void setCreator(User creator) { this.creator = creator; }

    public Set<User> getAttendees() {
        return attendees;
    }

    public void setAttendees(Set<User> attendees) {
        this.attendees = attendees;
    }

    public boolean isFull() {
        return attendees != null && attendees.size() >= capacity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBannerUrl() {
        return bannerUrl;
    }

    public void setBannerUrl(String bannerUrl) {
        this.bannerUrl = bannerUrl;
    }


}
