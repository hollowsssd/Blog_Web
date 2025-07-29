package com.example.Blog.controller;

import com.example.Blog.service.PostLikesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/likes")
public class PostLikesController {

    @Autowired
    private PostLikesService postLikesService;

    @GetMapping("/count/{postId}")
    public long getLikes(@PathVariable Integer postId) {
        return postLikesService.getLikeCount(postId);
    }

    @PostMapping("/toggle")
    public boolean toggleLike(@RequestParam Integer userId, @RequestParam Integer postId) {
        return postLikesService.toggleLike(userId, postId);
    }

    @GetMapping("/check")
    public boolean isLiked(@RequestParam Integer userId, @RequestParam Integer postId) {
        return postLikesService.isLiked(userId, postId);
    }

}
