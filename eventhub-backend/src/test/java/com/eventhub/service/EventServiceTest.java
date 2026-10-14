package com.eventhub.service;

import com.eventhub.exception.EventNotFoundException;
import com.eventhub.model.*;
import com.eventhub.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private UserCategoryScoreRepository userCategoryScoreRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private EventViewRepository eventViewRepository;

    @InjectMocks
    private EventService eventService;

    private User user;
    private Event event;
    private Category category;

    @BeforeEach
    void setUp() {

        user = new User();
        user.setId(1L);
        user.setName("Karthik");
        user.setEmail("abc@gmail.com");

        event = new Event();
        event.setId(100L);
        event.setTitle("AI Workshop");
        event.setCapacity(100);
        event.setReservedSeats(0);

        category = new Category();
        category.setId(10L);
        category.setName("AI");

        event.setCategoryRef(category);
    }

    @Test
    void shouldReturnUserNotFound_WhenUserDoesNotExist() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.empty());

        String result =
                eventService.rsvpToEvent(100L, user);

        assertEquals("User not found", result);

        verify(eventRepository, never())
                .saveAndFlush(any());

        verify(emailService, never())
                .sendEmail(any(), any(), any());
    }

    @Test
    void shouldThrowEventNotFound_WhenEventDoesNotExist() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(eventRepository.getEventOrThrow(100L))
                .thenThrow(new EventNotFoundException(100L));

        EventNotFoundException exception = assertThrows(
                EventNotFoundException.class,
                () -> eventService.rsvpToEvent(100L, user)
        );

        assertEquals(
                "Event not found with id 100",
                exception.getMessage()
        );

        verify(userRepository).findById(1L);
        verify(eventRepository).getEventOrThrow(100L);
    }

    @Test
    void shouldReturnEventFull_WhenEventIsFull() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(eventRepository.getEventOrThrow(100L))
                .thenReturn(event);

        event.setCapacity(2);
        event.setReservedSeats(2);

        String result =
                eventService.rsvpToEvent(100L, user);

        assertEquals("Event is full", result);

        verify(eventRepository, never())
                .saveAndFlush(any());

        verify(userRepository, never())
                .save(any());

        verify(emailService, never())
                .sendEmail(any(), any(), any());
    }

    @Test
    void shouldReturnAlreadyRSVPed_WhenUserAlreadyJoinedEvent() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(eventRepository.getEventOrThrow(100L))
                .thenReturn(event);

        user.getJoinedEvents().add(event);

        String result =
                eventService.rsvpToEvent(100L, user);

        assertEquals("Already RSVPed", result);

        verify(eventRepository, never())
                .saveAndFlush(any());

        verify(userRepository, never())
                .save(any());

        verify(emailService, never())
                .sendEmail(any(), any(), any());
    }

}