package com.paf.pronexusbackend.Repository;

import com.paf.pronexusbackend.model.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, Integer> {
    List<PostComment> findByPostIdOrderByCreatedAtDesc(Integer postId);
} 