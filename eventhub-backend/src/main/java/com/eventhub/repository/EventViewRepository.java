package com.eventhub.repository;

import com.eventhub.model.Event;
import com.eventhub.model.EventView;
import com.eventhub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventViewRepository
        extends JpaRepository<EventView, Long> {

    Optional<EventView> findByUserAndEvent(
            User user,
            Event event);
}