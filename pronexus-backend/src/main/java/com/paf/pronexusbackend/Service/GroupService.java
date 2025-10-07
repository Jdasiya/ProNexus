package com.paf.pronexusbackend.Service;

import com.paf.pronexusbackend.Repository.GroupRepository;
import com.paf.pronexusbackend.Repository.UserRepository;
import com.paf.pronexusbackend.model.Group;
import com.paf.pronexusbackend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Get all groups for a user (either created by or member of)
     * @param userId The user ID
     * @return List of groups
     */
    public List<Group> getGroupsForUser(Integer userId) {
        return groupRepository.findGroupsByUserIdOrMember(userId);
    }
    
    /**
     * Get a specific group by ID
     * @param groupId The group ID
     * @return Optional containing the group if found
     */
    public Optional<Group> getGroupById(Integer groupId) {
        return groupRepository.findById(groupId);
    }
    
    /**
     * Create a new group
     * @param title The group title
     * @param createdBy The ID of the user creating the group
     * @param memberIds List of user IDs to add as members
     * @return The created group
     */
    public Group createGroup(String title, Integer createdBy, List<Integer> memberIds) {
        Group group = new Group();
        group.setTitle(title);
        group.setCreatedBy(createdBy);
        group.setCreatedAt(LocalDateTime.now());
        group.setUpdatedAt(LocalDateTime.now());
        
        // Add members if provided
        if (memberIds != null && !memberIds.isEmpty()) {
            Set<User> members = userRepository.findAllById(memberIds)
                    .stream()
                    .collect(Collectors.toSet());
            group.setMembers(members);
        }
        
        return groupRepository.save(group);
    }
    
    /**
     * Update an existing group
     * @param groupId The ID of the group to update
     * @param title New title for the group
     * @param memberIds New list of member IDs
     * @return The updated group, or empty if not found
     */
    public Optional<Group> updateGroup(Integer groupId, String title, List<Integer> memberIds) {
        Optional<Group> groupOpt = groupRepository.findById(groupId);
        if (groupOpt.isPresent()) {
            Group group = groupOpt.get();
            
            // Update title if provided
            if (title != null && !title.trim().isEmpty()) {
                group.setTitle(title);
            }
            
            // Update members if provided
            if (memberIds != null) {
                Set<User> members = userRepository.findAllById(memberIds)
                        .stream()
                        .collect(Collectors.toSet());
                group.setMembers(members);
            }
            
            group.setUpdatedAt(LocalDateTime.now());
            return Optional.of(groupRepository.save(group));
        }
        return Optional.empty();
    }
    
    /**
     * Delete a group
     * @param groupId The ID of the group to delete
     * @return true if deleted, false if not found
     */
    public boolean deleteGroup(Integer groupId) {
        if (groupRepository.existsById(groupId)) {
            groupRepository.deleteById(groupId);
            return true;
        }
        return false;
    }
    
    /**
     * Add a user to a group
     * @param groupId The group ID
     * @param userId The user ID to add
     * @return The updated group, or empty if not found
     */
    public Optional<Group> addMemberToGroup(Integer groupId, Integer userId) {
        Optional<Group> groupOpt = groupRepository.findById(groupId);
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (groupOpt.isPresent() && userOpt.isPresent()) {
            Group group = groupOpt.get();
            User user = userOpt.get();
            
            group.addMember(user);
            group.setUpdatedAt(LocalDateTime.now());
            
            return Optional.of(groupRepository.save(group));
        }
        
        return Optional.empty();
    }
    
    /**
     * Remove a user from a group
     * @param groupId The group ID
     * @param userId The user ID to remove
     * @return The updated group, or empty if not found
     */
    public Optional<Group> removeMemberFromGroup(Integer groupId, Integer userId) {
        Optional<Group> groupOpt = groupRepository.findById(groupId);
        Optional<User> userOpt = userRepository.findById(userId);
        
        if (groupOpt.isPresent() && userOpt.isPresent()) {
            Group group = groupOpt.get();
            User user = userOpt.get();
            
            group.removeMember(user);
            group.setUpdatedAt(LocalDateTime.now());
            
            return Optional.of(groupRepository.save(group));
        }
        
        return Optional.empty();
    }
    
    /**
     * Get all members of a group
     * @param groupId The group ID
     * @return List of users who are members of the group, empty if group not found
     */
    public List<User> getGroupMembers(Integer groupId) {
        Optional<Group> groupOpt = groupRepository.findById(groupId);
        return groupOpt.map(group -> new ArrayList<>(group.getMembers()))
                .orElse(new ArrayList<>());
    }
} 