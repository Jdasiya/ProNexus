package com.paf.pronexusbackend.Controller;

import com.paf.pronexusbackend.model.PostLike;
import com.paf.pronexusbackend.Service.PostLikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/posts/likes")
@CrossOrigin(origins = "*")
public class PostLikeController {

    private final PostLikeService postLikeService;

    @Autowired
    public PostLikeController(PostLikeService postLikeService) {
        this.postLikeService = postLikeService;
    }

    @PostMapping("/{postId}/toggle")
    public ResponseEntity<?> toggleLike(
            @PathVariable Integer postId,
            @RequestParam Integer userId) {
        PostLike like = postLikeService.toggleLike(postId, userId);
        return ResponseEntity.ok(Map.of(
            "liked", like != null,
            "likeCount", postLikeService.getLikeCount(postId)
        ));
    }

    @GetMapping("/{postId}/count")
    public ResponseEntity<Long> getLikeCount(@PathVariable Integer postId) {
        return ResponseEntity.ok(postLikeService.getLikeCount(postId));
    }

    @GetMapping("/{postId}/user/{userId}")
    public ResponseEntity<Boolean> hasUserLiked(
            @PathVariable Integer postId,
            @PathVariable Integer userId) {
        return ResponseEntity.ok(postLikeService.hasUserLiked(postId, userId));
    }
} 