package com.example.Blog.controller;

import com.example.Blog.model.Comment;
import com.example.Blog.model.Posts;
import com.example.Blog.model.Users;
import com.example.Blog.service.CommentService;
import com.example.Blog.repository.PostRepository;
import com.example.Blog.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/comments")
@CrossOrigin(origins = "*") // for frontend to access
public class CommentController {

    @Autowired
    private CommentService commentService;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // GET comments for a post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable Integer postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }


    // POST new comment
    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody CommentRequest request) {
        Optional<Users> user = userRepository.findById(request.userId());
        Optional<Posts> post = postRepository.findById(request.postId());

        if (user.isEmpty() || post.isEmpty()) {
            return ResponseEntity.badRequest().body("User or Post not found");
        }

        Comment comment = new Comment(request.content(), user.get(), post.get());
        return ResponseEntity.ok(commentService.saveComment(comment));
    }

    // DTO for incoming request
    public record CommentRequest(Integer userId, Integer postId, String content) {}
}
