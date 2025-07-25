package com.example.Blog.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Blog.model.Posts;
@Repository
public interface BlogRepository extends JpaRepository<Posts, Integer> {

}
