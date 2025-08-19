package com.eventhub.dto;

import java.util.List;

public class AdminStatsDTO {
    private long totalUsers;
    private long totalEvents;
    private long totalRSVPs;
    private List<TopEventDTO> topEvents;

    // constructor, getters, setters

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getTotalRSVPs() {
        return totalRSVPs;
    }

    public void setTotalRSVPs(long totalRSVPs) {
        this.totalRSVPs = totalRSVPs;
    }

    public List<TopEventDTO> getTopEvents() {
        return topEvents;
    }

    public void setTopEvents(List<TopEventDTO> topEvents) {
        this.topEvents = topEvents;
    }
}
