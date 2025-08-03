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
    private PostRepository postsRepository;

    public List<Posts> getAllPosts() {
        return postsRepository.findAll();
    }

    public List<Posts> getAllPostsSortedByDate() {
        return postsRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Posts> getPostsSortedByLikes() {
        return postsRepository.findAllWithLikeCountSorted();
    }

    public Optional<Posts> getPostById(Integer id) {
        return postsRepository.findById(id);
    }

    public List<Posts> getPostsByUserId(Integer userId) {
        return postsRepository.findByUserId(userId);
    }

    // Tìm post theo tag id
    public List<Posts> getPostsByTagId(Integer tagId) {
        return postsRepository.findByTags_Id(tagId);
    }

    public Posts savePost(Posts post) {
        return postsRepository.save(post);
    }

    public void deletePost(Integer id) {
        postsRepository.deleteById(id);
    }

}
