package com.example.Blog.controller;

import com.example.Blog.service.JwtService;
import com.example.Blog.service.PostLikesService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/likes")
public class PostLikesController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PostLikesService postLikesService;

    @GetMapping("/count/{postId}")
    public long getLikes(@PathVariable Integer postId) {
        return postLikesService.getLikeCount(postId);
    }

    @PostMapping("/toggle")
    public boolean toggleLike(@RequestParam Integer postId, HttpServletRequest request) {
        Integer userId = extractUserIdFromToken(request);
        return postLikesService.toggleLike(userId, postId);
    }

    @GetMapping("/check")
    public boolean isLiked(@RequestParam Integer postId, HttpServletRequest request) {
        Integer userId = extractUserIdFromToken(request);
        return postLikesService.isLiked(userId, postId);
    }

    private Integer extractUserIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7); // remove "Bearer "
        return jwtService.extractId(token); // ✅ Use the injected instance here
    }


}
