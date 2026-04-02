package com.edutech.eventmanagementsystem.controller;

import com.edutech.eventmanagementsystem.entity.Event;
import com.edutech.eventmanagementsystem.entity.Notification;
import com.edutech.eventmanagementsystem.repository.EventRepository;
import com.edutech.eventmanagementsystem.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/client")
public class ClientController {

    @Autowired private EventRepository eventRepository;
    @Autowired private NotificationRepository notificationRepository;

    @GetMapping("/event/{id}")
    public ResponseEntity<Event> getEventDetails(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found")));
        } catch (Exception e) { return ResponseEntity.notFound().build(); }
    }

    // NEW: Get active events for the Catalog
    @GetMapping("/events/active")
    public ResponseEntity<List<Event>> getActiveEvents() {
        List<Event> all = eventRepository.findAll();
        List<Event> active = all.stream()
            .filter(e -> "SCHEDULED".equalsIgnoreCase(e.getStatus()) || "ONGOING".equalsIgnoreCase(e.getStatus()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(active);
    }

    // NEW: Client Booking triggers Planner Notification
    @PostMapping("/book/{eventId}")
    public ResponseEntity<?> bookEvent(@PathVariable Long eventId) {
        String clientName = SecurityContextHolder.getContext().getAuthentication().getName();
        Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
        
        Notification notif = new Notification();
        notif.setMessage("Client '" + clientName + "' secured an Entry Pass for Event: " + event.getTitle());
        notif.setTargetRole("PLANNER");
        notificationRepository.save(notif);
        
        return ResponseEntity.ok().body("{\"message\": \"Successfully booked!\"}");
    }
}
