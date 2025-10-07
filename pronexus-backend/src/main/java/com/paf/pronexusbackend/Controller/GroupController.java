package com.paf.pronexusbackend.Controller;

import com.paf.pronexusbackend.Service.GroupService;
import com.paf.pronexusbackend.model.Group;
import com.paf.pronexusbackend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
public class GroupController {

    @Autowired
    private GroupService groupService;
    
    /**
     * Get all groups for a user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getGroupsByUser(@PathVariable Integer userId) {
        List<Group> groups = groupService.getGroupsForUser(userId);
        
        // Convert to a simpler format with member count
        List<Map<String, Object>> response = groups.stream().map(group -> {
            Map<String, Object> groupData = new HashMap<>();
            groupData.put("id", group.getId());
            groupData.put("title", group.getTitle());
            groupData.put("createdBy", group.getCreatedBy());
            groupData.put("createdAt", group.getCreatedAt());
            groupData.put("updatedAt", group.getUpdatedAt());
            groupData.put("memberCount", group.getMembers().size());
            return groupData;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get a specific group
     */
    @GetMapping("/{groupId}")
    public ResponseEntity<Group> getGroup(@PathVariable Integer groupId) {
        Optional<Group> group = groupService.getGroupById(groupId);
        return group.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    /**
     * Get all members of a group
     */
    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<User>> getGroupMembers(@PathVariable Integer groupId) {
        List<User> members = groupService.getGroupMembers(groupId);
        if (members.isEmpty()) {
            Optional<Group> group = groupService.getGroupById(groupId);
            if (group.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
        }
        return ResponseEntity.ok(members);
    }
    
    /**
     * Create a new group
     */
    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody Map<String, Object> request) {
        String title = (String) request.get("title");
        Integer createdBy = (Integer) request.get("createdBy");
        @SuppressWarnings("unchecked")
        List<Integer> members = (List<Integer>) request.get("members");
        
        if (title == null || createdBy == null) {
            return ResponseEntity.badRequest().build();
        }
        
        Group createdGroup = groupService.createGroup(title, createdBy, members);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdGroup);
    }
    
    /**
     * Update an existing group
     */
    @PutMapping("/{groupId}")
    public ResponseEntity<Group> updateGroup(
            @PathVariable Integer groupId, 
            @RequestBody Map<String, Object> request) {
        String title = (String) request.get("title");
        @SuppressWarnings("unchecked")
        List<Integer> members = (List<Integer>) request.get("members");
        
        Optional<Group> updatedGroup = groupService.updateGroup(groupId, title, members);
        return updatedGroup.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    /**
     * Delete a group
     */
    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Integer groupId) {
        boolean deleted = groupService.deleteGroup(groupId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    
    /**
     * Add a member to a group
     */
    @PostMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Group> addMemberToGroup(
            @PathVariable Integer groupId,
            @PathVariable Integer userId) {
        Optional<Group> updatedGroup = groupService.addMemberToGroup(groupId, userId);
        return updatedGroup.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    /**
     * Remove a member from a group
     */
    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Group> removeMemberFromGroup(
            @PathVariable Integer groupId,
            @PathVariable Integer userId) {
        Optional<Group> updatedGroup = groupService.removeMemberFromGroup(groupId, userId);
        return updatedGroup.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
} 