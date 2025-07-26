package com.example.Blog.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Blog.model.Posts;
import com.example.Blog.repository.PostRepository;

@Service
public class PostService {

    @Autowired

    private PostRepository postRepository;

    public List<Posts> getAllPost() {
        return postRepository.findAll();
    }

    public Optional<Posts> getPostsById(int id) {
        return postRepository.findById(id);
    }

    public Posts savePosts(Posts posts) {
        return postRepository.save(posts);
    }

    public void deleteUsers(int id) {
        postRepository.deleteById(id);
    }

}
