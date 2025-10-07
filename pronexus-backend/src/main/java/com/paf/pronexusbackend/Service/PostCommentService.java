package com.paf.pronexusbackend.Service;

import com.paf.pronexusbackend.model.Post;
import com.paf.pronexusbackend.model.PostComment;
import com.paf.pronexusbackend.model.User;
import com.paf.pronexusbackend.Repository.PostCommentRepository;
import com.paf.pronexusbackend.Repository.PostRepository;
import com.paf.pronexusbackend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PostCommentService {

    private final PostCommentRepository postCommentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Autowired
    public PostCommentService(PostCommentRepository postCommentRepository, PostRepository postRepository, UserRepository userRepository) {
        this.postCommentRepository = postCommentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public List<PostComment> getPostComments(Integer postId) {
        return postCommentRepository.findByPostIdOrderByCreatedAtDesc(postId);
    }

    public PostComment addComment(Integer postId, Integer userId, String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PostComment comment = new PostComment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(content);

        return postCommentRepository.save(comment);
    }

    public void deleteComment(Integer commentId) {
        postCommentRepository.deleteById(commentId);
    }
} 