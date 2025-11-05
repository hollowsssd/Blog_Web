package com.example.Blog.controller;

import com.example.Blog.model.Comment;
import com.example.Blog.model.Posts;
import com.example.Blog.model.Users;
import com.example.Blog.service.CommentService;
import com.example.Blog.repository.PostRepository;
import com.example.Blog.repository.UserRepository;

import com.example.Blog.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @Autowired
    private JwtService jwtService;

    // GET comments for a post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable Integer postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }


    // POST new comment
    @PostMapping
    public ResponseEntity<?> createComment(
            @RequestBody CommentRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Bạn chưa đăng nhập.");
        }

        String token = authHeader.substring(7); // Bỏ "Bearer "

        try {
            jwtService.extract(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ.");
        }

        if (request.content() == null || request.content().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Nội dung bình luận không được để trống.");
        }

        if (request.content().length() > 10000) {
            return ResponseEntity.badRequest().body("Nội dung bình luận vượt quá 10.000 ký tự.");
        }

        Optional<Users> user = userRepository.findById(request.userId());
        Optional<Posts> post = postRepository.findById(request.postId());

        if (user.isEmpty() || post.isEmpty()) {
            return ResponseEntity.badRequest().body("User hoặc Post không tồn tại.");
        }

        Comment comment = new Comment(request.content().trim(), user.get(), post.get());
        return ResponseEntity.ok(commentService.saveComment(comment));
    }



    // DTO for incoming request
    public record CommentRequest(Integer userId, Integer postId, String content) {}
}
