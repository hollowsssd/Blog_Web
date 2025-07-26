package com.example.Blog.repository;

import com.example.Blog.model.PostLikesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Blog.model.PostLikes;
@Repository
public interface PostLikesRepository extends JpaRepository<PostLikes, PostLikesId> {




}