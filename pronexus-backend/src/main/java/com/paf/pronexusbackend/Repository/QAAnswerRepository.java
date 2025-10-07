package com.paf.pronexusbackend.Repository;

import com.paf.pronexusbackend.model.QAAnswer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QAAnswerRepository extends JpaRepository<QAAnswer, Integer> {
    
    /**
     * Find all answers for a specific post
     * @param postId The ID of the post
     * @return List of answers
     */
    List<QAAnswer> findByPostIdOrderByCreatedAtDesc(Integer postId);
    
    /**
     * Find all answers for a specific post with pagination
     * @param postId The ID of the post
     * @param pageable Pagination information
     * @return Page of answers
     */
    Page<QAAnswer> findByPostIdOrderByCreatedAtDesc(Integer postId, Pageable pageable);
    
    /**
     * Find all answers created by a specific user
     * @param userId The ID of the user who created the answers
     * @return List of answers
     */
    List<QAAnswer> findByCreatedBy(Integer userId);
    
    /**
     * Count the number of answers for a specific post
     * @param postId The ID of the post
     * @return Number of answers
     */
    long countByPostId(Integer postId);
} 