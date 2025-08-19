package com.eventhub.controller;

import com.eventhub.model.User;
import com.eventhub.service.EventService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private EventService eventService;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null || !user.getRole().equals("ADMIN")) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        return ResponseEntity.ok(eventService.getAdminStats());
    }

}
