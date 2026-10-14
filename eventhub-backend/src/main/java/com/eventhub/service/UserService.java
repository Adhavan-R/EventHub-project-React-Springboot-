package com.eventhub.service;

import com.eventhub.model.Category;
import com.eventhub.model.Event;
import com.eventhub.model.User;
import com.eventhub.model.UserCategoryScore;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.UserCategoryScoreRepository;
import com.eventhub.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.eventhub.model.PasswordResetToken;
import com.eventhub.repository.PasswordResetTokenRepository;

import java.security.SecureRandom;
import java.util.UUID;
import java.time.LocalDateTime;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private EmailService emailService;
    @Autowired private EventService eventService;
    @Autowired private EventRepository eventRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Autowired private UserCategoryScoreRepository userCategoryScoreRepository;
    @Autowired private CategoryService categoryService;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    public User register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        //sending welcome email for registered users
        String subject = "Welcome to EventHub – Registration Successful!";

        String body = "Hi " + user.getName() + ",\n\n"
                + "Welcome to EventHub! 🎉\n\n"
                + "Your account has been successfully registered.\n\n"
                + "With EventHub, you can:\n"
                + "- Create and manage your own events\n"
                + "- Discover and join events created by others\n"
                + "We're excited to have you on board!\n\n"
                + "Start exploring EventHub and find your next event.\n\n"
                + "Best regards,\n"
                + "EventHub Team";

        emailService.sendEmail(user.getEmail(), subject, body);

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

    public void saveUserInterests(
            User user,
            List<Long> categoryIds) {

        for (Long categoryId : categoryIds) {

            Category category =
                    categoryService.getCategoryById(categoryId);

            if (!userCategoryScoreRepository
                    .existsByUserAndCategory(user, category)) {

                UserCategoryScore score =
                        new UserCategoryScore();

                score.setUser(user);
                score.setCategory(category);
                score.setScore(10);

                userCategoryScoreRepository.save(score);
            }
        }
    }

    public void forgotPassword(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SecureRandom random = new SecureRandom();

        String otp = String.format(
                "%06d",
                random.nextInt(1000000)
        );

        PasswordResetToken resetToken =
                passwordResetTokenRepository.findByEmail(email)
                        .orElse(new PasswordResetToken());

        // Start a completely new reset flow
        resetToken.setEmail(email);
        resetToken.setOtp(otp);
        resetToken.setOtpExpiry(
                LocalDateTime.now().plusMinutes(5)
        );

        // Invalidate previous reset-token
        resetToken.setResetToken(null);
        resetToken.setResetTokenExpiry(null);
        resetToken.setVerified(false);

        passwordResetTokenRepository.save(resetToken);

        String subject = "EventHub Password Reset OTP";

        String body =
                "Your EventHub password reset OTP is: "
                        + otp
                        + "\n\nThis OTP is valid for 5 minutes.";

        emailService.sendEmail(email, subject, body);
    }



    public String verifyOtp(String email, String otp) {

        PasswordResetToken resetToken =
                passwordResetTokenRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException("OTP request not found"));

        // Check OTP expiry
        if (resetToken.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        // Check OTP
        if (!resetToken.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        // Generate temporary reset token
        String token = UUID.randomUUID().toString();

        resetToken.setResetToken(token);
        resetToken.setResetTokenExpiry(
                LocalDateTime.now().plusMinutes(10)
        );

        resetToken.setVerified(true);

        passwordResetTokenRepository.save(resetToken);

        return token;
    }

    public void resetPassword(String resetToken, String newPassword) {

        PasswordResetToken passwordResetToken =
                passwordResetTokenRepository.findByResetToken(resetToken)
                        .orElseThrow(() ->
                                new RuntimeException("Invalid reset token"));

        // Make sure OTP was successfully verified
        if (!passwordResetToken.isVerified()) {
            throw new RuntimeException("OTP verification required");
        }

        // Check reset token expiry
        if (passwordResetToken.getResetTokenExpiry()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException("Reset token has expired");
        }

        // Find the user
        User user = userRepository.findByEmail(
                passwordResetToken.getEmail()
        ).orElseThrow(() ->
                new RuntimeException("User not found"));

        // Hash the new password
        String hashedPassword =
                passwordEncoder.encode(newPassword);

        user.setPassword(hashedPassword);

        userRepository.save(user);

        // Reset token should be single-use
        passwordResetTokenRepository.delete(passwordResetToken);
    }

}
