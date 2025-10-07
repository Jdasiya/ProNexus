package com.paf.pronexusbackend.Controller;

import com.paf.pronexusbackend.model.Post;
import com.paf.pronexusbackend.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getUserPosts(@PathVariable Integer userId) {
        return ResponseEntity.ok(postService.getUserPosts(userId));
    }

    @PostMapping
    public ResponseEntity<Post> createPost(
            @RequestParam("userId") Integer userId,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "media", required = false) MultipartFile media) {
        return ResponseEntity.ok(postService.createPost(userId, content, media));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<Post> getPost(@PathVariable Integer postId) {
        return postService.getPost(postId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{postId}")
    public ResponseEntity<Post> updatePost(
            @PathVariable Integer postId,
            @RequestBody Map<String, String> updateRequest) {
        String content = updateRequest.get("content");
        return postService.updatePost(postId, content)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Integer postId) {
        postService.deletePost(postId);
        return ResponseEntity.noContent().build();
    }
} 