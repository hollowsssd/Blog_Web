package com.example.Blog.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Blog.service.JwtService;
import com.example.Blog.service.PostLikesService;

import jakarta.servlet.http.HttpServletRequest;

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
        return jwtService.extractId(token); // Use the injected instance here
    }

    @GetMapping("/findPostLiked/{userId}")
    public List<Map <String, Object>> getMethodName(@PathVariable Integer userId) {
        List<Object[]> results = postLikesService.findPostOnPostLike(userId);
        List<Map <String, Object>> res= new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", row[0]);
            map.put("content",row[1]);
            map.put("imageUrl",row[2]);
            map.put("createdAt",row[3]);
            map.put("title",row[4]);
            map.put("description",row[5]);
            map.put("tags",row[6]);
            map.put("name",row[7]);

            res.add(map);
        }
        return res;
        
    }

}
