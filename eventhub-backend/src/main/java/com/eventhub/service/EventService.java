package com.eventhub.service;

import com.eventhub.dto.AdminStatsDTO;
import com.eventhub.dto.TopEventDTO;
import com.eventhub.model.Event;
import com.eventhub.model.User;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EmailService emailService;


    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }


    public Event createEvent(Event event, User creator) {

        event.setCreator(creator);
        eventRepository.findByCreator(creator).add(event);
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

    public String rsvpToEvent(Long eventId, User sessionUser) {
        // Fetch user from DB to attach to Hibernate session
        Optional<User> optionalUser = userRepository.findById(sessionUser.getId());
        if (optionalUser.isEmpty()) {
            return "User not found";
        }

        User user = optionalUser.get();  // Now it's managed by Hibernate

        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) {
            return "Event not found";
        }

        if (event.isFull()) {
            return "Event is full";
        }

        if (user.getJoinedEvents().contains(event)) {
            return "Already RSVPed";
        }

        user.getJoinedEvents().add(event); // Save only user is enough, since it's owner
        userRepository.save(user);

        // ✉️ Send confirmation email
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

        userRepository.save(user);

        return "RSVP removed successfully";
    }


    public List<Event> searchEvents(String keyword, String category, String location, LocalDateTime startDate, LocalDateTime endDate) {
        return eventRepository.searchEvents(keyword, category, location, startDate, endDate);
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







}
