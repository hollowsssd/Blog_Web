package com.example.Blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Blog.model.PostTags;
import com.example.Blog.model.PostTagsId;
@Repository
public interface PostTagsRepository extends JpaRepository<PostTags, PostTagsId> {




}
