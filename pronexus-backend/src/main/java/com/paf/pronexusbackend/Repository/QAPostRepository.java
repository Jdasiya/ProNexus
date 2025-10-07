package com.paf.pronexusbackend.Repository;

import com.paf.pronexusbackend.model.QAPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QAPostRepository extends JpaRepository<QAPost, Integer> {
    
    /**
     * Find all posts created by a specific user
     * @param userId The ID of the user who created the posts
     * @return List of posts
     */
    List<QAPost> findByCreatedBy(Integer userId);
    
    /**
     * Find all posts created by a specific user with pagination
     * @param userId The ID of the user who created the posts
     * @param pageable Pagination information
     * @return Page of posts
     */
    Page<QAPost> findByCreatedBy(Integer userId, Pageable pageable);
    
    /**
     * Find all posts with pagination
     * @param pageable Pagination information
     * @return Page of posts
     */
    Page<QAPost> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    /**
     * Search posts by title or description
     * @param searchTerm The search term
     * @param pageable Pagination information
     * @return Page of posts
     */
    @Query("SELECT p FROM QAPost p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<QAPost> searchPosts(@Param("searchTerm") String searchTerm, Pageable pageable);
} 