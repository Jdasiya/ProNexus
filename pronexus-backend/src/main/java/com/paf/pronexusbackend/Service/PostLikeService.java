package com.paf.pronexusbackend.Service;

import com.paf.pronexusbackend.model.Post;
import com.paf.pronexusbackend.model.PostLike;
import com.paf.pronexusbackend.model.User;
import com.paf.pronexusbackend.Repository.PostLikeRepository;
import com.paf.pronexusbackend.Repository.PostRepository;
import com.paf.pronexusbackend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Autowired
    public PostLikeService(PostLikeRepository postLikeRepository, PostRepository postRepository, UserRepository userRepository) {
        this.postLikeRepository = postLikeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public PostLike toggleLike(Integer postId, Integer userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<PostLike> existingLike = postLikeRepository.findByPostIdAndUserId(postId, userId);

        if (existingLike.isPresent()) {
            postLikeRepository.delete(existingLike.get());
            return null;
        } else {
            PostLike newLike = new PostLike();
            newLike.setPost(post);
            newLike.setUser(user);
            return postLikeRepository.save(newLike);
        }
    }

    public long getLikeCount(Integer postId) {
        return postLikeRepository.countByPostId(postId);
    }

    public boolean hasUserLiked(Integer postId, Integer userId) {
        return postLikeRepository.findByPostIdAndUserId(postId, userId).isPresent();
    }
} 