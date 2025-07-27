package com.example.Blog.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Blog.model.CommentLikes;
import com.example.Blog.model.CommentLikesId;
import com.example.Blog.repository.CommentLikesRepository;



@Service
public class CommentLikesService {

    @Autowired

    private CommentLikesRepository commentLikesRepository;

    public List<CommentLikes> getAllPostLikes() {
        return commentLikesRepository.findAll();
    }

    public Optional<CommentLikes> getCommentLikesById(int commentId, int userId) {
        CommentLikesId id = new CommentLikesId(userId, commentId);
        return commentLikesRepository.findById(id);
    }

    public CommentLikes saveCommentLikes(CommentLikes commentLikes) {
        return commentLikesRepository.save(commentLikes);
    }

    public void deleteCommentLikes(int commentId, int userId) {
        CommentLikesId id = new CommentLikesId(commentId, userId);
        commentLikesRepository.deleteById(id);
    }

}
