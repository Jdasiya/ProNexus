package com.pronexus.controller;

import com.pronexus.entity.Connection;
import com.paf.pronexusbackend.model.User;
import com.pronexus.service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "http://localhost:3000")
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;

    @PostMapping("/send/{senderId}/{receiverId}")
    public ResponseEntity<Connection> sendConnectionRequest(
            @PathVariable Integer senderId,
            @PathVariable Integer receiverId) {
        return ResponseEntity.ok(connectionService.sendConnectionRequest(senderId, receiverId));
    }

    @PostMapping("/accept/{connectionId}")
    public ResponseEntity<Connection> acceptConnectionRequest(@PathVariable Integer connectionId) {
        return ResponseEntity.ok(connectionService.acceptConnectionRequest(connectionId));
    }

    @PostMapping("/reject/{connectionId}")
    public ResponseEntity<Connection> rejectConnectionRequest(@PathVariable Integer connectionId) {
        return ResponseEntity.ok(connectionService.rejectConnectionRequest(connectionId));
    }

    @GetMapping("/pending/{userId}")
    public ResponseEntity<List<User>> getPendingRequests(@PathVariable Integer userId) {
        return ResponseEntity.ok(connectionService.getPendingRequests(userId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<User>> getConnections(@PathVariable Integer userId) {
        return ResponseEntity.ok(connectionService.getConnections(userId));
    }

    @GetMapping("/check/{user1Id}/{user2Id}")
    public ResponseEntity<Boolean> areConnected(
            @PathVariable Integer user1Id,
            @PathVariable Integer user2Id) {
        return ResponseEntity.ok(connectionService.areConnected(user1Id, user2Id));
    }
} 