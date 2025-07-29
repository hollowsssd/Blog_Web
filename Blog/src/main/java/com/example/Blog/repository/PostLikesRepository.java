package com.example.Blog.repository;

import com.example.Blog.model.PostLikesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Blog.model.PostLikes;

import java.util.Optional;

@Repository
public interface PostLikesRepository extends JpaRepository<PostLikes, PostLikesId> {
    long countByPostId(Integer postId);
    Optional<PostLikes> findByUserIdAndPostId(Integer userId, Integer postId);
    void deleteByUserIdAndPostId(Integer userId, Integer postId);
}