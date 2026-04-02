package com.edutech.eventmanagementsystem.service;

import com.edutech.eventmanagementsystem.entity.Event;
import com.edutech.eventmanagementsystem.entity.Notification;
import com.edutech.eventmanagementsystem.repository.EventRepository;
import com.edutech.eventmanagementsystem.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EventService {

    @Autowired private EventRepository eventRepository;
    @Autowired private NotificationRepository notificationRepository;

    public Event createEvent(Event event) {
        Event savedEvent = eventRepository.save(event);
        
        // Track Planner Username
        String plannerName = SecurityContextHolder.getContext().getAuthentication().getName();
        Notification notif = new Notification();
        notif.setMessage("Planner '" + plannerName + "' drafted a new event: " + savedEvent.getTitle() + " (ID: #" + savedEvent.getEventID() + ")");
        notif.setTargetRole("STAFF");
        notificationRepository.save(notif);
        
        return savedEvent;
    }

    public List<Event> getAllEvents() { return eventRepository.findAll(); }
    
    public Event getEventById(Long id) { 
        return eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found")); 
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        String oldStatus = event.getStatus();

        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setDateTime(eventDetails.getDateTime());
        event.setLocation(eventDetails.getLocation());
        event.setStatus(eventDetails.getStatus());
        Event updatedEvent = eventRepository.save(event);

        // Track Staff Username
        String staffName = SecurityContextHolder.getContext().getAuthentication().getName();
        if (oldStatus != null && !oldStatus.equals(updatedEvent.getStatus())) {
            Notification notif = new Notification();
            notif.setMessage("Staff User '" + staffName + "' updated Event #" + updatedEvent.getEventID() + " status to " + updatedEvent.getStatus());
            notif.setTargetRole("PLANNER");
            notificationRepository.save(notif);
        }
        return updatedEvent;
    }
}