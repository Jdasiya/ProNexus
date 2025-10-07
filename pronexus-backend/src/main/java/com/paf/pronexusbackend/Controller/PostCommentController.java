package com.paf.pronexusbackend.Controller;

import com.paf.pronexusbackend.model.PostComment;
import com.paf.pronexusbackend.Service.PostCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/posts/comments")
@CrossOrigin(origins = "*")
public class PostCommentController {

    private final PostCommentService postCommentService;

    @Autowired
    public PostCommentController(PostCommentService postCommentService) {
        this.postCommentService = postCommentService;
    }

    @GetMapping("/{postId}")
    public ResponseEntity<List<PostComment>> getPostComments(@PathVariable Integer postId) {
        return ResponseEntity.ok(postCommentService.getPostComments(postId));
    }

    @PostMapping("/{postId}")
    public ResponseEntity<PostComment> addComment(
            @PathVariable Integer postId,
            @RequestParam Integer userId,
            @RequestParam String content) {
        return ResponseEntity.ok(postCommentService.addComment(postId, userId, content));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Integer commentId) {
        postCommentService.deleteComment(commentId);
        return ResponseEntity.noContent().build();
    }
} 