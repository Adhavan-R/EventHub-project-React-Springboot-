package com.eventhub.service;

import com.eventhub.dto.AdminStatsDTO;
import com.eventhub.dto.TopEventDTO;
import com.eventhub.model.*;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.EventViewRepository;
import com.eventhub.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventhub.dto.CreateEventRequest;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

import com.eventhub.repository.UserCategoryScoreRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserCategoryScoreRepository userCategoryScoreRepository;

    private final CategoryService categoryService;

    private final UserRepository userRepository;

    @Autowired
    private EventViewRepository eventViewRepository;


    public EventService(EventRepository eventRepository, UserRepository userRepository, CategoryService categoryService) {
        this.eventRepository = eventRepository;
        this.categoryService = categoryService;
        this.userRepository = userRepository;
    }


//    public Event createEvent(Event event, User creator) {
//
//        event.setCreator(creator);
//        eventRepository.findByCreator(creator).add(event);
//        return eventRepository.save(event);
//    }



    public Event createEvent(CreateEventRequest request, User creator) {

        Event event = new Event();

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setDate(request.getDate());
        event.setCapacity(request.getCapacity());

        // Find existing category or create a new one
        Category category =
                categoryService.getOrCreateCategory(request.getCategory());

        // Maintain both category fields
        event.setCategoryRef(category);
        event.setCategory(category.getName());

        // Set the event creator
        event.setCreator(creator);

        // Save and return the event
        return eventRepository.save(event);
    }



    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> getEventsByCreator(User creator) {
        return eventRepository.findByCreator(creator);
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    public Set<Event> getMyRSVPs(User user){

        Set<Event> joinedEvents = user.getJoinedEvents();
        return joinedEvents;
    }

//    @Transactional
//    public String rsvpToEvent(Long eventId, User sessionUser) {
//        // Fetch user from DB to attach to Hibernate session
//        Optional<User> optionalUser = userRepository.findById(sessionUser.getId());
//        if (optionalUser.isEmpty()) {
//            return "User not found";
//        }
//
//        User user = optionalUser.get();  // Now it's managed by Hibernate
//
//        Event event = eventRepository.findById(eventId).orElse(null);
//        if (event == null) {
//            return "Event not found";
//        }
//
//        if (event.isFull()) {
//            return "Event is full";
//        }
//
//        if (user.getJoinedEvents().contains(event)) {
//            return "Already RSVPed";
//        }
//
//        event.setReservedSeats(event.getReservedSeats() + 1);
//        eventRepository.save(event);
//
//        user.getJoinedEvents().add(event);
//        userRepository.save(user);
//
//
//        updateCategoryScore(user, event.getCategoryRef(), 5);
//
//        // ✉️ Send confirmation email
//        String subject = "Event RSVP Confirmation: " + event.getTitle();
//        String body = "Hi " + user.getName() + ",\n\n" +
//                "You have successfully RSVPed to the event:\n" +
//                "Title: " + event.getTitle() + "\n" +
//                "Date: " + event.getDate() + "\n" +
//                "Location: " + event.getLocation() + "\n\n" +
//                "Thank you,\nEventHub Team";
//
//        try {
//            emailService.sendEmail(user.getEmail(), subject, body);
//        } catch (Exception e) {
//            System.out.println("Email failed: " + e.getMessage());
//        }
//
//        return "RSVP successful";
//    }

    @Transactional
    public String rsvpToEvent(Long eventId, User sessionUser) {

        // Fetch user from DB to attach to Hibernate session
        Optional<User> optionalUser = userRepository.findById(sessionUser.getId());
        if (optionalUser.isEmpty()) {
            return "User not found";
        }

        User user = optionalUser.get();

        Event event = eventRepository.getEventOrThrow(eventId); // implemented CUSTOM exception.

        if (event.isFull()) {
            return "Event is full";
        }

        if (user.getJoinedEvents().contains(event)) {
            return "Already RSVPed";
        }

        // Update Event first (increments version)
        event.setReservedSeats(event.getReservedSeats() + 1);
        eventRepository.saveAndFlush(event); // Flush immediately executes SQL.

        // Then update User
        user.getJoinedEvents().add(event);
        userRepository.save(user);

        updateCategoryScore(user, event.getCategoryRef(), 5);

        // Send confirmation email asynchronously
        String subject = "Event RSVP Confirmation: " + event.getTitle();
        String body = "Hi " + user.getName() + ",\n\n" +
                "You have successfully RSVPed to the event:\n" +
                "Title: " + event.getTitle() + "\n" +
                "Date: " + event.getDate() + "\n" +
                "Location: " + event.getLocation() + "\n\n" +
                "Thank you,\nEventHub Team";

        emailService.sendEmail(user.getEmail(), subject, body);

        return "RSVP successful";
    }

    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }

    @Transactional
    public String deleteEvent(Long eventId, User sessionUser) {
        Optional<Event> optional = eventRepository.findById(eventId);
        if (optional.isEmpty()) return "Event not found";

        Event event = optional.get();

        if (!event.getCreator().getId().equals(sessionUser.getId())) {
            return "Unauthorized";
        }

        // Send cancellation emails
        for (User attendee : event.getAttendees()) {
            emailService.sendEventCancelledEmail(attendee.getEmail(), event.getTitle());
            attendee.getJoinedEvents().remove(event);
        }

        event.getAttendees().clear(); // clean up many-to-many
        eventRepository.delete(event);
        return "Event deleted and users notified";
    }


    public List<Event> getEventsByCategory(String category) {
        return eventRepository.findByCategoryIgnoreCase(category);
    }

    @Transactional
    public boolean adminDeleteEvent(Long eventId) {
        Optional<Event> optional = eventRepository.findById(eventId);
        if (optional.isEmpty()) return false;

        Event event = optional.get();

        for (User attendee : event.getAttendees()) {
            emailService.sendEventCancelledEmail(attendee.getEmail(), event.getTitle());
            attendee.getJoinedEvents().remove(event);
            userRepository.save(attendee); // update join table
        }

        event.getAttendees().clear();
        eventRepository.delete(event);
        return true;
    }

    @Transactional
    public String unRsvpFromEvent(Long eventId, User sessionUser) {
        Optional<User> optionalUser = userRepository.findById(sessionUser.getId());
        if (optionalUser.isEmpty()) {
            return "User not found";
        }

        User user = optionalUser.get();
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (optionalEvent.isEmpty()) {
            return "Event not found";
        }

        Event event = optionalEvent.get();

        if (!user.getJoinedEvents().contains(event)) {
            return "You have not RSVPed to this event";
        }

        user.getJoinedEvents().remove(event);
        event.getAttendees().remove(user);

        event.setReservedSeats(
                Math.max(0, event.getReservedSeats() - 1)
        );
        eventRepository.save(event);

        userRepository.save(user);

        return "RSVP removed successfully";
    }


    public List<Event> searchEvents(
            String keyword,
            String category,
            String location,
            LocalDateTime startDate,
            LocalDateTime endDate,
            User user) {

        if (user != null &&
                category != null &&
                !category.isBlank()) {

            Category selectedCategory =
                    categoryService.getCategoryByName(category);

            updateCategoryScore(
                    user,
                    selectedCategory,
                    1);
        }

        return eventRepository.searchEvents(
                keyword,
                category,
                location,
                startDate,
                endDate);
    }


    public AdminStatsDTO getAdminStats() {

        long totalUsers = userRepository.countAllUsers();
        long totalEvents = eventRepository.countAllEvents();
        Long totalRSVPs = userRepository.countAllRSVPs();
        if (totalRSVPs == null) totalRSVPs = 0L;

        List<Object[]> rawTopEvents = eventRepository.findTop5EventsByRSVPs();
        List<TopEventDTO> topEvents = rawTopEvents.stream()
                .map(obj -> new TopEventDTO((Long) obj[0], (String) obj[1], ((Number) obj[2]).intValue()))
                .toList();

        AdminStatsDTO stats = new AdminStatsDTO();
        stats.setTotalUsers(totalUsers);
        stats.setTotalEvents(totalEvents);
        stats.setTotalRSVPs(totalRSVPs);
        stats.setTopEvents(topEvents);

        return stats;
    }

    public String generateCSVForRSVPs(Event event) {

        StringBuilder builder = new StringBuilder();
        builder.append("Name,Email\n");

        for (User user : event.getAttendees()) {
            builder.append(user.getName())
                    .append(",")
                    .append(user.getEmail())
                    .append("\n");
        }

        return builder.toString();
    }

    public Event updateBanner(Event event, String bannerUrl){

        event.setBannerUrl(bannerUrl);
        eventRepository.save(event);

        return event;
    }

    public List<Event> getRecommendedEvents(User user) {

        List<Event> events = eventRepository.findAll();

        List<UserCategoryScore> scores =
                userCategoryScoreRepository.findByUser(user);

        Map<Long, Integer> scoreMap = new HashMap<>();

        for (UserCategoryScore score : scores) {
            scoreMap.put(
                    score.getCategory().getId(),
                    score.getScore()
            );

            System.out.println(
                    "CATEGORY = " +
                            score.getCategory().getName() +
                            " | SCORE = " +
                            score.getScore()
            );
        }



        events.sort((e1, e2) -> {

            int score1 = scoreMap.getOrDefault(
                    e1.getCategoryRef().getId(),
                    0);

            int score2 = scoreMap.getOrDefault(
                    e2.getCategoryRef().getId(),
                    0);

            return Integer.compare(score2, score1);
        });


        System.out.println("----- RECOMMENDED EVENT ORDER -----");

        for (Event event : events) {

            int score = scoreMap.getOrDefault(
                    event.getCategoryRef().getId(),
                    0);

            System.out.println(
                    event.getTitle() +
                            " | " +
                            event.getCategoryRef().getName() +
                            " | SCORE = " +
                            score
            );
        }


        return events;
    }

    public Event getEventDetails(Long eventId, User user) {

        System.out.println("getEventDetails called");

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (user != null) {
            recordEventView(user, event);
        }

        return event;
    }

    private void recordEventView(User user, Event event) {

        System.out.println("recordEventView called");

        Optional<EventView> optionalView =
                eventViewRepository.findByUserAndEvent(user, event);

        // First time viewing this event
        if (optionalView.isEmpty()) {

            EventView eventView = new EventView();
            eventView.setUser(user);
            eventView.setEvent(event);
            eventView.setLastViewedAt(LocalDateTime.now());

            eventViewRepository.save(eventView);

            System.out.println(
                    "Category Ref = "
                            + event.getCategoryRef());

            updateCategoryScore(user, event.getCategoryRef(), 2);
            return;
        }

        // User has viewed this event before
        EventView eventView = optionalView.get();

        LocalDateTime lastViewed = eventView.getLastViewedAt();

        long hours =
                Duration.between(lastViewed, LocalDateTime.now())
                        .toHours();

        if (hours >= 12) {

            eventView.setLastViewedAt(LocalDateTime.now());

            eventViewRepository.save(eventView);

            updateCategoryScore(user, event.getCategoryRef(), 2);
        }
    }

    private void updateCategoryScore(
            User user,
            Category category,
            int points) {

        System.out.println(
                "Looking for score row: "
                        + user.getId()
                        + " category="
                        + category.getId());

        Optional<UserCategoryScore> optionalScore =
                userCategoryScoreRepository
                        .findByUserAndCategory(user, category);

        if (optionalScore.isPresent()) {

            UserCategoryScore score = optionalScore.get();

            score.setScore(score.getScore() + points);

            userCategoryScoreRepository.save(score);

        } else {

            UserCategoryScore score = new UserCategoryScore();

            score.setUser(user);
            score.setCategory(category);
            score.setScore(points);

            userCategoryScoreRepository.save(score);
        }
    }


    @Transactional
    public void migrateReservedSeats() {

        List<Event> events = eventRepository.findAll();

        for (Event event : events) {

            int attendeeCount = event.getAttendees().size();

            event.setReservedSeats(attendeeCount);
        }

        eventRepository.saveAll(events);

        System.out.println("Reserved seats migration completed.");
    }





}
