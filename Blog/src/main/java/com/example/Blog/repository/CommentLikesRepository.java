package com.example.Blog.repository;

import com.example.Blog.model.CommentLikesId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Blog.model.CommentLikes;
@Repository
public interface CommentLikesRepository extends JpaRepository<CommentLikes, CommentLikesId> {




}