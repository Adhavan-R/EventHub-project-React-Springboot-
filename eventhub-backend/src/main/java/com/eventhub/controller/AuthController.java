package com.eventhub.controller;

import com.eventhub.dto.InterestSelectionRequest;
import com.eventhub.dto.RegisterRequest;
import com.eventhub.dto.UpdateProfileRequest;
import com.eventhub.model.User;
import com.eventhub.repository.UserCategoryScoreRepository;
import com.eventhub.repository.UserRepository;
import com.eventhub.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserService userService;
   @Autowired private UserCategoryScoreRepository userCategoryScoreRepository;

//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody User user) {
//
//        User saved = userService.register(user);
//        return ResponseEntity.ok("Registered successfully");
//    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        userService.register(user);

        return ResponseEntity.ok("Registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request, HttpSession session) {

        String email = request.get("email");
        String password = request.get("password");

        User user = userService.login(email, password);
        session.setAttribute("user", user); // store in session
        return ResponseEntity.ok("Login successful");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(HttpSession session){

        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("Not logged in");

        String resultMessage=userService.deleteUser(user);
        session.invalidate();

        return ResponseEntity.ok(resultMessage);

    }

    @GetMapping("/me")
    public ResponseEntity<?> currentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) return ResponseEntity.status(401).body("Not logged in");
        return ResponseEntity.ok(user);
    }

    @PostMapping("/makeadmin/{id}")
    public ResponseEntity<?> makeAdmin(@PathVariable Long id, HttpSession session) {

        User requester = (User) session.getAttribute("user");
        if (requester == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        long userId=id;
        String result = userService.makeAdmin(requester,userId);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/removeadmin/{id}")
    public ResponseEntity<?> removeAdmin(@PathVariable Long id, HttpSession session) {

        User requester = (User) session.getAttribute("user");
        if (requester == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        long adminId=id;
        String result=userService.revokeAdmin(requester, adminId);

        return ResponseEntity.ok("Admin demoted to user");
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileRequest request
            , HttpSession session) {

        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        try {

            User updatedUser = new User();

            updatedUser.setName(request.getName());
            updatedUser.setEmail(request.getEmail());
            updatedUser.setPassword(request.getPassword());

            User savedUser = userService.updateUserProfile(sessionUser.getId(), updatedUser);

            // Update session user with new (updated) data
            session.setAttribute("user", savedUser);
            return ResponseEntity.ok("Profile updated successfully");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/interests")
    public ResponseEntity<?> saveInterests(
            @Valid @RequestBody InterestSelectionRequest request,
            HttpSession session) {

        User user =
                (User) session.getAttribute("user");

        if (user == null) {
            return ResponseEntity.status(401)
                    .body("Not logged in");
        }

        userService.saveUserInterests(
                user,
                request.getCategoryIds());

        return ResponseEntity.ok(
                "Interests saved successfully");
    }

    @GetMapping("/interests")
    public ResponseEntity<?> getMyInterests(
            HttpSession session) {

        User user = (User) session.getAttribute("user");

        if (user == null) {
            return ResponseEntity.status(401)
                    .body("Not logged in");
        }

        int count = userCategoryScoreRepository
                .findByUser(user)
                .size();

        return ResponseEntity.ok(count);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");

        userService.forgotPassword(email);

        return ResponseEntity.ok(
                "If an account exists with this email, an OTP has been sent."
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");
        String otp = request.get("otp");

        try {

            String resetToken =
                    userService.verifyOtp(email, otp);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "OTP verified successfully",
                            "resetToken", resetToken
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody Map<String, String> request) {

        String resetToken = request.get("resetToken");
        String newPassword = request.get("newPassword");

        try {

            userService.resetPassword(
                    resetToken,
                    newPassword
            );

            return ResponseEntity.ok(
                    "Password reset successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }


}
