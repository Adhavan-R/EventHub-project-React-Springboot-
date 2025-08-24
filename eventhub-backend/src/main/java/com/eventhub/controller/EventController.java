package com.eventhub.controller;

import com.eventhub.dto.CalendarEventDTO;
import com.eventhub.dto.EventDTO;
import com.eventhub.dto.MapEventDTO;
import com.eventhub.dto.UserDTO;
import com.eventhub.model.Event;
import com.eventhub.model.User;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.UserRepository;
import com.eventhub.service.EventService;
import com.eventhub.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;
    @Autowired
    private UserService userService;

    // ✅ Create a new event
    @PostMapping("/create")
    public ResponseEntity<?> createEvent(@RequestBody Event event, HttpSession session) {

        User creator = (User) session.getAttribute("user");
        if (creator == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Event event1=event;
        Event saved = eventService.createEvent(event1, creator);
        return ResponseEntity.ok(new EventDTO(saved));
    }

    // ✅ Get all public events
    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        List<EventDTO> eventDTOs = events.stream()
                .map(EventDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(eventDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Long id) {

        long eventId=id;

        Event event = eventService.getEventById(id);
        return  ResponseEntity.ok(new EventDTO(event));
    }


    //  Get only events created by the logged-in user
    @GetMapping("/myevents")
    public ResponseEntity<?> getMyEvents(HttpSession session) {
        User creator = (User) session.getAttribute("user");
        if (creator == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        List<Event> events = eventService.getEventsByCreator(creator);
        List<EventDTO> dtos = events.stream().map(EventDTO::new).toList();

        return ResponseEntity.ok(dtos); // ✅ return clean list of DTOs
    }


    @PostMapping("/rsvp/{eventId}")
    public ResponseEntity<?> rsvpEvent(@PathVariable Long eventId, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String result = eventService.rsvpToEvent(eventId, user);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/myrsvps")
    public List<EventDTO> getMyRSVPs(@SessionAttribute("user") User sessionUser) {

        User user= userService.getUserByID(sessionUser.getId());

        Set<Event> joinedEvents = eventService.getMyRSVPs(user); // Now safe

        return joinedEvents.stream()
                .map(EventDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}/isRSVPed")
    public boolean isRSVPed(@PathVariable Long id, @SessionAttribute(value = "user", required = false) User sessionUser) {
        if (sessionUser == null) {
            System.out.println("Session user is null — not logged in.");
            return false;
        }

        User user = userService.getUserByID(sessionUser.getId());
        if (user == null) return false;

        Event event = eventService.getEventById(id);
        if (event == null) return false;

        return event.getAttendees().contains(user);
    }


    // gets the users who are rsvped to their event
    @GetMapping("/rsvps/{eventId}")
    public ResponseEntity<?> getEventRSVPs(@PathVariable Long eventId, HttpSession session) {
        User creator = (User) session.getAttribute("user");
        if (creator == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Event event = eventService.getEventById(eventId);
        if (event == null) {
            return ResponseEntity.status(404).body("Event not found");
        }

        if (!event.getCreator().getId().equals(creator.getId())) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        Set<UserDTO> attendees = event.getAttendees().stream()
                .map(UserDTO::new)
                .collect(Collectors.toSet());

        return ResponseEntity.ok(attendees);
    }

    @PutMapping("/{eventId}/edit")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long eventId,
            @RequestBody Event updatedEvent,
            HttpSession session
    ) {
        User creator = (User) session.getAttribute("user");
        if (creator == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Event event = eventService.getEventById(eventId);
        if (event == null) {
            return ResponseEntity.status(404).body("Event not found");
        }

        if (!event.getCreator().getId().equals(creator.getId())) {
            return ResponseEntity.status(403).body("You are not allowed to edit this event");
        }

        // Update fields
        event.setTitle(updatedEvent.getTitle());
        event.setDescription(updatedEvent.getDescription());
        event.setDate(updatedEvent.getDate());
        event.setLocation(updatedEvent.getLocation());
        event.setCapacity(updatedEvent.getCapacity());
        event.setBannerUrl(updatedEvent.getBannerUrl());

        Event saved = eventService.saveEvent(event);

        return ResponseEntity.ok(new EventDTO(saved));
    }

    @DeleteMapping("/{eventId}/delete")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId, HttpSession session) {
        User creator = (User) session.getAttribute("user");
        if (creator == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Event event = eventService.getEventById(eventId);
        if (event == null) {
            return ResponseEntity.status(404).body("Event not found");
        }

        if (!event.getCreator().getId().equals(creator.getId())) {
            return ResponseEntity.status(403).body("You are not allowed to delete this event");
        }

        eventService.deleteEvent(eventId,creator);
        return ResponseEntity.ok("Event deleted successfully");
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<EventDTO>> getEventsByCategory(@PathVariable String category) {
        List<Event> events = eventService.getEventsByCategory(category);
        List<EventDTO> dtos = events.stream().map(EventDTO::new).toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/admin/events")
    public ResponseEntity<List<Event>> getAllEventsForAdmin(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null || !"ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        return ResponseEntity.ok(eventService.getAllEvents());
    }


    private boolean isAdmin(User user) {
        return user.getRole() != null && user.getRole().equalsIgnoreCase("ADMIN");
    }

    @DeleteMapping("/admin/delete/{eventId}")
    public ResponseEntity<?> deleteEventByAdmin(@PathVariable Long eventId, HttpSession session) {

        User user = (User) session.getAttribute("user");
        if (user == null || !isAdmin(user)) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        boolean deleted = eventService.adminDeleteEvent(eventId);
        if (deleted) {
            return ResponseEntity.ok("Event deleted by admin.");
        } else {
            return ResponseEntity.status(404).body("Event not found.");
        }
    }

    @DeleteMapping("/unrsvp/{eventId}")
    public ResponseEntity<?> unRsvpEvent(@PathVariable Long eventId, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        String result = eventService.unRsvpFromEvent(eventId, user);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search")
    public ResponseEntity<List<EventDTO>> searchEvents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        List<Event> events = eventService.searchEvents(keyword, category, location, startDate, endDate);
        List<EventDTO> eventDTOs = events.stream().map(EventDTO::new).toList();
        return ResponseEntity.ok(eventDTOs);
    }

    @PostMapping("/upload-banner")
    public ResponseEntity<String> uploadBanner(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "uploads/";
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.createDirectories(filePath.getParent());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/uploads/" + fileName; // URL used to serve it via frontend
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload");
        }
    }


    @PutMapping("/{id}/banner")
    public ResponseEntity<Event> updateBanner(@PathVariable Long id, @RequestBody Map<String, String> body) {

        String bannerUrl = body.get("bannerUrl");
        Event event = eventService.getEventById(id);

        if (event!=null) {

            Event updatedEvent=eventService.updateBanner(event, bannerUrl);
            return ResponseEntity.ok(updatedEvent);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/{eventId}/export-rsvps")
    public ResponseEntity<?> exportRSVPs(@PathVariable Long eventId, HttpSession session) throws IOException {
        User creator = (User) session.getAttribute("user");
        if (creator == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Event event = eventService.getEventById(eventId);
        if (event == null) {
            return ResponseEntity.status(404).body("Event not found");
        }

        // Only creator or admin allowed
        if (!event.getCreator().getId().equals(creator.getId()) && !"ADMIN".equals(creator.getRole())) {
            return ResponseEntity.status(403).body("You are not authorized to export this event");
        }

        String csv = eventService.generateCSVForRSVPs(event);

        ByteArrayInputStream inputStream = new ByteArrayInputStream(csv.getBytes());
        InputStreamResource resource = new InputStreamResource(inputStream);

        System.out.println("Event title for CSV: " + event.getTitle());

        // Sanitize the title for use in filename
        String safeTitle = event.getTitle().replaceAll("[^a-zA-Z0-9-_\\.]", "_");

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"rsvps_event_" + safeTitle + ".csv\"")
                .body(resource);

    }

    @GetMapping("/calendar")
    public ResponseEntity<List<CalendarEventDTO>> getEventsForCalendar() {
        List<Event> events = eventService.getAllEvents();
        List<CalendarEventDTO> calendarEvents = events.stream()
                .map(e -> new CalendarEventDTO(e.getId(), e.getTitle(), e.getDate()))
                .toList();

        return ResponseEntity.ok(calendarEvents);
    }

    @GetMapping("/map")
    public ResponseEntity<List<MapEventDTO>> getEventsForMap() {
        List<Event> events = eventService.getAllEvents();
        List<MapEventDTO> mapEvents = events.stream()
                .filter(e -> e.getLocation() != null && !e.getLocation().isBlank())
                .map(e -> new MapEventDTO(e.getId(), e.getTitle(), e.getLocation()))
                .toList();

        return ResponseEntity.ok(mapEvents);
    }

}
