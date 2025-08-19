package com.eventhub.repository;

import com.eventhub.model.Event;
import com.eventhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByCreator(User creator);

    List<Event> findByCategoryIgnoreCase(String category);

    @Query("SELECT e FROM Event e WHERE " +
            "(:keyword IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:category IS NULL OR LOWER(e.category) = LOWER(:category)) AND " +
            "(:location IS NULL OR LOWER(e.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:startDate IS NULL OR e.date >= :startDate) AND " +
            "(:endDate IS NULL OR e.date <= :endDate)")
    List<Event> searchEvents(
            @Param("keyword") String keyword,
            @Param("category") String category,
            @Param("location") String location,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );


    @Query("SELECT COUNT(e) FROM Event e")
    long countAllEvents();

    @Query("SELECT e.id, e.title, SIZE(e.attendees) as rsvpCount FROM Event e ORDER BY SIZE(e.attendees) DESC LIMIT 5")
    List<Object[]> findTop5EventsByRSVPs();


}

