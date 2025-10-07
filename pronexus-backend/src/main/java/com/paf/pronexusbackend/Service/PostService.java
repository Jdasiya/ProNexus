package com.paf.pronexusbackend.Service;

import com.paf.pronexusbackend.model.Post;
import com.paf.pronexusbackend.model.User;
import com.paf.pronexusbackend.Repository.PostRepository;
import com.paf.pronexusbackend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Autowired
    public PostService(PostRepository postRepository, UserRepository userRepository, FileStorageService fileStorageService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> getUserPosts(Integer userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Post createPost(Integer userId, String content, MultipartFile mediaFile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setUser(user);
        post.setContent(content);

        if (mediaFile != null && !mediaFile.isEmpty()) {
            String mediaType = mediaFile.getContentType().startsWith("image/") ? "IMAGE" : "VIDEO";
            String mediaUrl = fileStorageService.storeFile(mediaFile, "post");
            post.setMediaUrl(mediaUrl);
            post.setMediaType(Post.MediaType.valueOf(mediaType));
        }

        return postRepository.save(post);
    }

    public Optional<Post> getPost(Integer postId) {
        return postRepository.findById(postId);
    }

    public Optional<Post> updatePost(Integer postId, String content) {
        return postRepository.findById(postId)
                .map(post -> {
                    post.setContent(content);
                    return postRepository.save(post);
                });
    }

    public void deletePost(Integer postId) {
        postRepository.deleteById(postId);
    }
} 