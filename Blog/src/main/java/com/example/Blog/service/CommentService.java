package com.example.Blog.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Blog.model.Comment;
import com.example.Blog.repository.CommentRepository;

@Service
public class CommentService {

    @Autowired

    private CommentRepository commentRepository;

    public List<Comment> getAllComment() {
        return commentRepository.findAll();
    }

    public Optional<Comment> getCommentById(int id) {
        return commentRepository.findById(id);
    }

    public Comment saveComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public void deleteComment(int id) {
        commentRepository.deleteById(id);
    }

}
