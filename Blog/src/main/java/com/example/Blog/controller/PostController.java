package com.example.Blog.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Blog.model.Posts;
import com.example.Blog.service.PostService;

@RestController // đổi sang RestController để trả JSON
@RequestMapping("/post")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping
    public List<Posts> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public Optional<Posts> getPostById(@PathVariable Integer id) {
        return postService.getPostById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Posts> getPostsByUser(@PathVariable Integer userId) {
        return postService.getPostsByUserId(userId);
    }

    @GetMapping("/tag/{tagId}")
    public List<Posts> getPostsByTag(@PathVariable Integer tagId) {
        return postService.getPostsByTagId(tagId);
    }

    @PostMapping
    public Posts savePost(@RequestBody Posts post) {
        return postService.savePost(post);
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Integer id) {
        postService.deletePost(id);
    }
}
