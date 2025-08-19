
package com.eventhub.dto;

public class TopEventDTO {
    private Long eventId;
    private String title;
    private int rsvpCount;

    public TopEventDTO(Long eventId, String title, int rsvpCount) {
        this.eventId = eventId;
        this.title = title;
        this.rsvpCount = rsvpCount;
    }

    // getters and setters

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getRsvpCount() {
        return rsvpCount;
    }

    public void setRsvpCount(int rsvpCount) {
        this.rsvpCount = rsvpCount;
    }
}
