package com.example.Blog.service;

import java.util.List;
import java.util.Optional;

import com.example.Blog.model.PostLikesId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Blog.model.PostLikes;
import com.example.Blog.repository.PostLikesRepository;

@Service
public class PostLikesService {

    @Autowired

    private PostLikesRepository postLikesRepository;

    public List<PostLikes> getAllPostLikes() {
        return postLikesRepository.findAll();
    }

    public Optional<PostLikes> getPostLikesById(int postId, int userId) {
        PostLikesId id = new PostLikesId(userId, postId);
        return postLikesRepository.findById(id);
    }

    public PostLikes savePostLikes(PostLikes postlikes) {
        return postLikesRepository.save(postlikes);
    }

    public void deletePostLikes(int postId, int userId) {
        PostLikesId id = new PostLikesId(userId, postId);
        postLikesRepository.deleteById(id);
    }

}
