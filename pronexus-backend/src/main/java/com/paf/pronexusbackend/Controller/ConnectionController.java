package com.paf.pronexusbackend.Controller;

import com.paf.pronexusbackend.model.Connection;
import com.paf.pronexusbackend.model.User;
import com.paf.pronexusbackend.Service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "http://localhost:3000")
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;

    @PostMapping("/request/{senderId}/{receiverId}")
    public ResponseEntity<Connection> sendConnectionRequest(
            @PathVariable Integer senderId,
            @PathVariable Integer receiverId) {
        return ResponseEntity.ok(connectionService.sendConnectionRequest(senderId, receiverId));
    }

    @PutMapping("/accept/{connectionId}")
    public ResponseEntity<Connection> acceptConnectionRequest(@PathVariable Integer connectionId) {
        return ResponseEntity.ok(connectionService.acceptConnectionRequest(connectionId));
    }

    @PutMapping("/reject/{connectionId}")
    public ResponseEntity<Void> rejectConnectionRequest(@PathVariable Integer connectionId) {
        connectionService.rejectConnectionRequest(connectionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove/{user1Id}/{user2Id}")
    public ResponseEntity<Void> removeConnection(
            @PathVariable Integer user1Id,
            @PathVariable Integer user2Id) {
        connectionService.removeConnection(user1Id, user2Id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pending/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getPendingRequests(@PathVariable Integer userId) {
        return ResponseEntity.ok(connectionService.getPendingRequests(userId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getConnections(@PathVariable Integer userId) {
        return ResponseEntity.ok(connectionService.getConnections(userId));
    }

    @GetMapping("/check/{user1Id}/{user2Id}")
    public ResponseEntity<String> getConnectionStatus(
            @PathVariable Integer user1Id,
            @PathVariable Integer user2Id) {
        return ResponseEntity.ok(connectionService.getConnectionStatus(user1Id, user2Id));
    }
} 