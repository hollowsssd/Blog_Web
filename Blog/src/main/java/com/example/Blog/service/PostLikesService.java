package com.example.Blog.service;

import com.example.Blog.model.PostLikes;
import com.example.Blog.model.PostLikesId;
import com.example.Blog.repository.PostLikesRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PostLikesService {

    @Autowired
    private PostLikesRepository postLikesRepository;

    public long getLikeCount(Integer postId) {
        return postLikesRepository.countByPostId(postId);
    }

    @Transactional // ✅ ADD THIS
    public boolean toggleLike(Integer userId, Integer postId) {
        Optional<PostLikes> existing = postLikesRepository.findByUserIdAndPostId(userId, postId);
        if (existing.isPresent()) {
            postLikesRepository.deleteByUserIdAndPostId(userId, postId);
            return false; // unliked
        } else {
            PostLikes like = new PostLikes(userId, postId);
            postLikesRepository.save(like);
            return true; // liked
        }
    }


    public boolean isLiked(Integer userId, Integer postId) {
        return postLikesRepository.findByUserIdAndPostId(userId, postId).isPresent();
    }
}
