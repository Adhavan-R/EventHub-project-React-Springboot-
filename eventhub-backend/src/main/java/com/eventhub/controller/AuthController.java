package com.eventhub.controller;

import com.eventhub.dto.UserDTO;
import com.eventhub.model.User;
import com.eventhub.repository.UserRepository;
import com.eventhub.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserService userService;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User saved = userService.register(user);
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
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser, HttpSession session) {
        User sessionUser = (User) session.getAttribute("user");
        if (sessionUser == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        try {
            User savedUser = userService.updateUserProfile(sessionUser.getId(), updatedUser);
            // Update session with new data
            session.setAttribute("user", savedUser);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }




}
