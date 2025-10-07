package com.paf.pronexusbackend.Controller;

import com.paf.pronexusbackend.Service.QAService;
import com.paf.pronexusbackend.model.QAAnswer;
import com.paf.pronexusbackend.model.QAPost;
import com.paf.pronexusbackend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/qa")
@CrossOrigin(origins = "*")
public class QAController {

    @Autowired
    private QAService qaService;
    
    // ===== Post Endpoints =====
    
    /**
     * Get all posts with pagination
     */
    @GetMapping("/posts")
    public ResponseEntity<Map<String, Object>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<QAPost> postsPage;
            
            if (search != null && !search.trim().isEmpty()) {
                postsPage = qaService.searchPosts(search, pageable);
            } else {
                postsPage = qaService.getAllPosts(pageable);
            }
            
            List<Map<String, Object>> posts = enhancePostsWithUserInfo(postsPage.getContent());
            
            Map<String, Object> response = new HashMap<>();
            response.put("posts", posts);
            response.put("currentPage", postsPage.getNumber());
            response.put("totalItems", postsPage.getTotalElements());
            response.put("totalPages", postsPage.getTotalPages());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get posts by user
     */
    @GetMapping("/posts/user/{userId}")
    public ResponseEntity<Map<String, Object>> getPostsByUser(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<QAPost> postsPage = qaService.getPostsByUser(userId, pageable);
            
            List<Map<String, Object>> posts = enhancePostsWithUserInfo(postsPage.getContent());
            
            Map<String, Object> response = new HashMap<>();
            response.put("posts", posts);
            response.put("currentPage", postsPage.getNumber());
            response.put("totalItems", postsPage.getTotalElements());
            response.put("totalPages", postsPage.getTotalPages());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get a specific post by ID
     */
    @GetMapping("/posts/{postId}")
    public ResponseEntity<Map<String, Object>> getPost(@PathVariable Integer postId) {
        Optional<QAPost> postOpt = qaService.getPostById(postId);
        
        if (postOpt.isPresent()) {
            QAPost post = postOpt.get();
            Map<String, Object> postData = postToMap(post);
            
            // Add user info
            Optional<User> userOpt = qaService.getUserById(post.getCreatedBy());
            userOpt.ifPresent(user -> {
                postData.put("username", user.getUsername());
                postData.put("userData", user.getUserData());
            });
            
            return ResponseEntity.ok(postData);
        }
        
        return ResponseEntity.notFound().build();
    }
    
    /**
     * Create a new post
     */
    @PostMapping("/posts")
    public ResponseEntity<QAPost> createPost(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "fileType", required = false) String fileType,
            @RequestParam("createdBy") Integer createdBy) {
        
        try {
            if (title == null || description == null || createdBy == null) {
                return ResponseEntity.badRequest().build();
            }
            
            QAPost post = qaService.createPost(title, description, file, fileType, createdBy);
            return ResponseEntity.status(HttpStatus.CREATED).body(post);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Update an existing post
     */
    @PutMapping("/posts/{postId}")
    public ResponseEntity<QAPost> updatePost(
            @PathVariable Integer postId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "fileType", required = false) String fileType) {
        
        try {
            Optional<QAPost> updatedPost = qaService.updatePost(postId, title, description, file, fileType);
            return updatedPost.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Delete a post
     */
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Integer postId) {
        try {
            boolean deleted = qaService.deletePost(postId);
            return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // ===== Answer Endpoints =====
    
    /**
     * Get all answers for a post
     */
    @GetMapping("/posts/{postId}/answers")
    public ResponseEntity<Map<String, Object>> getAnswers(
            @PathVariable Integer postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<QAAnswer> answersPage = qaService.getAnswersByPost(postId, pageable);
            
            List<Map<String, Object>> answers = enhanceAnswersWithUserInfo(answersPage.getContent());
            
            Map<String, Object> response = new HashMap<>();
            response.put("answers", answers);
            response.put("currentPage", answersPage.getNumber());
            response.put("totalItems", answersPage.getTotalElements());
            response.put("totalPages", answersPage.getTotalPages());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Create a new answer for a post
     */
    @PostMapping("/posts/{postId}/answers")
    public ResponseEntity<QAAnswer> createAnswer(
            @PathVariable Integer postId,
            @RequestParam("content") String content,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "fileType", required = false) String fileType,
            @RequestParam("createdBy") Integer createdBy) {
        
        try {
            if (content == null || createdBy == null) {
                return ResponseEntity.badRequest().build();
            }
            
            Optional<QAAnswer> answerOpt = qaService.createAnswer(postId, content, file, fileType, createdBy);
            return answerOpt.map(answer -> ResponseEntity.status(HttpStatus.CREATED).body(answer))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Update an existing answer
     */
    @PutMapping("/answers/{answerId}")
    public ResponseEntity<QAAnswer> updateAnswer(
            @PathVariable Integer answerId,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "fileType", required = false) String fileType) {
        
        try {
            Optional<QAAnswer> updatedAnswer = qaService.updateAnswer(answerId, content, file, fileType);
            return updatedAnswer.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Delete an answer
     */
    @DeleteMapping("/answers/{answerId}")
    public ResponseEntity<Void> deleteAnswer(@PathVariable Integer answerId) {
        try {
            boolean deleted = qaService.deleteAnswer(answerId);
            return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // ===== Helper Methods =====
    
    /**
     * Convert a post to a map and add answer count
     */
    private Map<String, Object> postToMap(QAPost post) {
        Map<String, Object> postData = new HashMap<>();
        postData.put("id", post.getId());
        postData.put("title", post.getTitle());
        postData.put("description", post.getDescription());
        
        // Add file information and generate file URL if fileName exists
        if (post.getFileName() != null) {
            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/files/download/")
                    .path(post.getFileName())
                    .toUriString();
            
            postData.put("fileName", post.getFileName());
            postData.put("fileUrl", fileUrl);
            postData.put("fileType", post.getFileType());
        }
        
        postData.put("createdBy", post.getCreatedBy());
        postData.put("createdAt", post.getCreatedAt());
        postData.put("updatedAt", post.getUpdatedAt());
        postData.put("answerCount", post.getAnswers().size());
        return postData;
    }
    
    /**
     * Enhance posts with user information
     */
    private List<Map<String, Object>> enhancePostsWithUserInfo(List<QAPost> posts) {
        return posts.stream().map(post -> {
            Map<String, Object> postData = postToMap(post);
            
            // Add user info
            Optional<User> userOpt = qaService.getUserById(post.getCreatedBy());
            userOpt.ifPresent(user -> {
                postData.put("username", user.getUsername());
                postData.put("userData", user.getUserData());
            });
            
            return postData;
        }).collect(Collectors.toList());
    }
    
    /**
     * Enhance answers with user information
     */
    private List<Map<String, Object>> enhanceAnswersWithUserInfo(List<QAAnswer> answers) {
        return answers.stream().map(answer -> {
            Map<String, Object> answerData = new HashMap<>();
            answerData.put("id", answer.getId());
            answerData.put("content", answer.getContent());
            
            // Add file information and generate file URL if fileName exists
            if (answer.getFileName() != null) {
                String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/files/download/")
                        .path(answer.getFileName())
                        .toUriString();
                
                answerData.put("fileName", answer.getFileName());
                answerData.put("fileUrl", fileUrl);
                answerData.put("fileType", answer.getFileType());
            }
            
            answerData.put("createdBy", answer.getCreatedBy());
            answerData.put("createdAt", answer.getCreatedAt());
            answerData.put("updatedAt", answer.getUpdatedAt());
            answerData.put("postId", answer.getPost().getId());
            
            // Add user info
            Optional<User> userOpt = qaService.getUserById(answer.getCreatedBy());
            userOpt.ifPresent(user -> {
                answerData.put("username", user.getUsername());
                answerData.put("userData", user.getUserData());
            });
            
            return answerData;
        }).collect(Collectors.toList());
    }
} 