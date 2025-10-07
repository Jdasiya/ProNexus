package com.paf.pronexusbackend.Service;

import com.paf.pronexusbackend.Repository.QAAnswerRepository;
import com.paf.pronexusbackend.Repository.QAPostRepository;
import com.paf.pronexusbackend.Repository.UserRepository;
import com.paf.pronexusbackend.model.QAAnswer;
import com.paf.pronexusbackend.model.QAPost;
import com.paf.pronexusbackend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class QAService {

    @Autowired
    private QAPostRepository postRepository;
    
    @Autowired
    private QAAnswerRepository answerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    // ===== Post Methods =====
    
    /**
     * Create a new question post
     * @param title The post title
     * @param description The post description
     * @param file Attached file (optional)
     * @param fileType Type of file (image/video)
     * @param createdBy User ID of creator
     * @return The created post
     */
    public QAPost createPost(String title, String description, MultipartFile file, String fileType, Integer createdBy) {
        QAPost post = new QAPost();
        post.setTitle(title);
        post.setDescription(description);
        post.setCreatedBy(createdBy);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        
        // Handle file upload if present
        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file, "qapost");
            post.setFileName(fileName);
            post.setFileType(fileType);
        }
        
        return postRepository.save(post);
    }
    
    /**
     * Get a specific post by ID
     * @param postId The post ID
     * @return Optional containing the post if found
     */
    public Optional<QAPost> getPostById(Integer postId) {
        return postRepository.findById(postId);
    }
    
    /**
     * Get all posts with pagination
     * @param pageable Pagination information
     * @return Page of posts
     */
    public Page<QAPost> getAllPosts(Pageable pageable) {
        return postRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
    
    /**
     * Get all posts by a specific user
     * @param userId The user ID
     * @param pageable Pagination information
     * @return Page of posts
     */
    public Page<QAPost> getPostsByUser(Integer userId, Pageable pageable) {
        return postRepository.findByCreatedBy(userId, pageable);
    }
    
    /**
     * Search posts by title or description
     * @param searchTerm The search term
     * @param pageable Pagination information
     * @return Page of posts
     */
    public Page<QAPost> searchPosts(String searchTerm, Pageable pageable) {
        return postRepository.searchPosts(searchTerm, pageable);
    }
    
    /**
     * Update an existing post
     * @param postId The post ID
     * @param title New title
     * @param description New description
     * @param file New file
     * @param fileType New file type
     * @return The updated post, or empty if not found
     */
    public Optional<QAPost> updatePost(Integer postId, String title, String description, MultipartFile file, String fileType) {
        Optional<QAPost> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            QAPost post = postOpt.get();
            
            if (title != null && !title.trim().isEmpty()) {
                post.setTitle(title);
            }
            
            if (description != null && !description.trim().isEmpty()) {
                post.setDescription(description);
            }
            
            // Handle file upload if present
            if (file != null && !file.isEmpty()) {
                String fileName = fileStorageService.storeFile(file, "qapost");
                post.setFileName(fileName);
                post.setFileType(fileType);
            }
            
            post.setUpdatedAt(LocalDateTime.now());
            
            return Optional.of(postRepository.save(post));
        }
        return Optional.empty();
    }
    
    /**
     * Delete a post
     * @param postId The post ID
     * @return true if deleted, false if not found
     */
    @Transactional
    public boolean deletePost(Integer postId) {
        if (postRepository.existsById(postId)) {
            // Delete answers first
            answerRepository.deleteAll(answerRepository.findByPostIdOrderByCreatedAtDesc(postId));
            // Delete post
            postRepository.deleteById(postId);
            return true;
        }
        return false;
    }
    
    // ===== Answer Methods =====
    
    /**
     * Create a new answer
     * @param postId The ID of the post being answered
     * @param content The answer content
     * @param file Attached file (optional)
     * @param fileType Type of file (image/video)
     * @param createdBy User ID of creator
     * @return The created answer, or empty if post not found
     */
    public Optional<QAAnswer> createAnswer(Integer postId, String content, MultipartFile file, String fileType, Integer createdBy) {
        Optional<QAPost> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            QAPost post = postOpt.get();
            
            QAAnswer answer = new QAAnswer();
            answer.setContent(content);
            answer.setCreatedBy(createdBy);
            answer.setCreatedAt(LocalDateTime.now());
            answer.setUpdatedAt(LocalDateTime.now());
            answer.setPost(post);
            
            // Handle file upload if present
            if (file != null && !file.isEmpty()) {
                String fileName = fileStorageService.storeFile(file, "qaanswer");
                answer.setFileName(fileName);
                answer.setFileType(fileType);
            }
            
            return Optional.of(answerRepository.save(answer));
        }
        return Optional.empty();
    }
    
    /**
     * Get a specific answer by ID
     * @param answerId The answer ID
     * @return Optional containing the answer if found
     */
    public Optional<QAAnswer> getAnswerById(Integer answerId) {
        return answerRepository.findById(answerId);
    }
    
    /**
     * Get all answers for a specific post
     * @param postId The post ID
     * @param pageable Pagination information
     * @return Page of answers
     */
    public Page<QAAnswer> getAnswersByPost(Integer postId, Pageable pageable) {
        return answerRepository.findByPostIdOrderByCreatedAtDesc(postId, pageable);
    }
    
    /**
     * Update an existing answer
     * @param answerId The answer ID
     * @param content New content
     * @param file New file
     * @param fileType New file type
     * @return The updated answer, or empty if not found
     */
    public Optional<QAAnswer> updateAnswer(Integer answerId, String content, MultipartFile file, String fileType) {
        Optional<QAAnswer> answerOpt = answerRepository.findById(answerId);
        if (answerOpt.isPresent()) {
            QAAnswer answer = answerOpt.get();
            
            if (content != null && !content.trim().isEmpty()) {
                answer.setContent(content);
            }
            
            // Handle file upload if present
            if (file != null && !file.isEmpty()) {
                String fileName = fileStorageService.storeFile(file, "qaanswer");
                answer.setFileName(fileName);
                answer.setFileType(fileType);
            }
            
            answer.setUpdatedAt(LocalDateTime.now());
            
            return Optional.of(answerRepository.save(answer));
        }
        return Optional.empty();
    }
    
    /**
     * Delete an answer
     * @param answerId The answer ID
     * @return true if deleted, false if not found
     */
    public boolean deleteAnswer(Integer answerId) {
        if (answerRepository.existsById(answerId)) {
            answerRepository.deleteById(answerId);
            return true;
        }
        return false;
    }
    
    /**
     * Get the user who created a post or answer
     * @param userId The user ID
     * @return Optional containing the user if found
     */
    public Optional<User> getUserById(Integer userId) {
        return userRepository.findById(userId);
    }
} 