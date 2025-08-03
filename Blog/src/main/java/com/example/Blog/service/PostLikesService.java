package com.example.Blog.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Blog.model.PostLikes;
import com.example.Blog.repository.PostLikesRepository;

import jakarta.transaction.Transactional;

@Service
public class PostLikesService {

    @Autowired
    private PostLikesRepository postLikesRepository;

    public long getLikeCount(Integer postId) {
        return postLikesRepository.countByPostId(postId);
    }

    @Transactional //  ADD THIS
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

    public List<Object[]> findPostOnPostLike(Integer userId){
        return postLikesRepository.findByLikePosts(userId);
    }

}
