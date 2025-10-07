package com.paf.pronexusbackend.Repository;

import com.paf.pronexusbackend.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Integer> {
    
    /**
     * Find all groups created by a specific user
     * @param userId The ID of the user who created the groups
     * @return List of groups
     */
    List<Group> findByCreatedBy(Integer userId);
    
    /**
     * Find all groups that a user is a member of
     * @param userId The ID of the user
     * @return List of groups
     */
    @Query("SELECT g FROM Group g JOIN g.members m WHERE m.id = :userId")
    List<Group> findGroupsByMember(@Param("userId") Integer userId);
    
    /**
     * Find all groups that a user is either a creator of or a member of
     * @param userId The ID of the user
     * @return List of groups
     */
    @Query("SELECT DISTINCT g FROM Group g LEFT JOIN g.members m WHERE g.createdBy = :userId OR m.id = :userId")
    List<Group> findGroupsByUserIdOrMember(@Param("userId") Integer userId);
} 