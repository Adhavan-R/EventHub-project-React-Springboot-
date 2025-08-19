package com.eventhub.service;

import com.eventhub.model.Event;
import com.eventhub.model.User;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private EmailService emailService;
    @Autowired private EventService eventService;
    @Autowired private EventRepository eventRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public User register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Incorrect password");
        }
        return user;
    }

    public User getUserByID(Long id){

        User user = userRepository.findById(id).orElseThrow();
        return user;
    }

    @Transactional
    public String deleteUser(User user){

        User managedUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        long userid= managedUser.getId();
        String username= managedUser.getName();

        for(Event event:managedUser.getJoinedEvents()){
            event.getAttendees().remove(managedUser);
        }

        // Delete created events
        for (Event event : managedUser.getCreatedEvents()) {
            // Send cancellation emails before deleting
            for (User attendee : event.getAttendees()) {
                emailService.sendEventCancelledEmail(attendee.getEmail(), event.getTitle());
                attendee.getJoinedEvents().remove(event);
            }
            eventRepository.delete(event);
        }

        userRepository.delete(managedUser);
        return username + " with id "+userid+" is deleted successfully";
    }

    public User updateUserProfile(Long userId, User updatedUser) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!existingUser.getEmail().equals(updatedUser.getEmail())) {
            // Check if email is already taken
            if (userRepository.findByEmail(updatedUser.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email already in use");
            }
        }

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());

        // Optional: Change password if a new one is provided
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            String hashed = passwordEncoder.encode(updatedUser.getPassword());
            existingUser.setPassword(hashed);
        }

        return userRepository.save(existingUser);
    }

    public String makeAdmin(User requester, long userId){

        if (!"ADMIN".equals(requester.getRole())) {
            return "Only admins can make other admins.";
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return "User not found";
        }

        user.setRole("ADMIN");
        userRepository.save(user);

        return "User promoted to admin";
    }

    public String revokeAdmin(User requester, long adminId){

        if (!"ADMIN".equals(requester.getRole())) {
            return "Only admins can revoke other admins.";
        }

        User user = userRepository.findById(adminId).orElse(null);
        if (user == null) {
            return "Admin not found";
        }

        user.setRole("USER");
        userRepository.save(user);

        return "Admin demoted to user";
    }

}
