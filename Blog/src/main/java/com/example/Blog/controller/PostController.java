package com.example.Blog.controller;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.Blog.model.Posts;
import com.example.Blog.model.Tags;
import com.example.Blog.model.Users;
import com.example.Blog.service.PostService;
import com.example.Blog.service.TagService;
import com.example.Blog.service.UsersService;

@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UsersService usersService;

    @Autowired
    private TagService tagService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @GetMapping
    public List<Posts> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public Optional<Posts> getPostById(@PathVariable Integer id) {
        return postService.getPostById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Posts> getPostsByUser(@PathVariable Integer userId) {
        return postService.getPostsByUserId(userId);
    }

    @GetMapping("/tag/{tagId}")
    public List<Posts> getPostsByTag(@PathVariable Integer tagId) {
        return postService.getPostsByTagId(tagId);
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> createPost(
            @RequestParam("file") MultipartFile file,
            @RequestParam("content") String content,
            @RequestParam(value = "isPublished", defaultValue = "false") boolean isPublished,
            @RequestParam("userId") Integer userId,
            @RequestParam("description") String description,
            @RequestParam("title") String title,
            @RequestParam(value = "tags", required = false) Set<Integer> tagIds) {
        try {
            // Save image
            String filePath = saveImage(file);

            // Fetch user
            Users user = usersService.getUserById(userId);
            if (user == null) {
                throw new RuntimeException("User not found");
            }

            // Fetch tags
            Set<Tags> tags = new HashSet<>(tagService.getTagsByIds(tagIds));

            // Create post
            Posts post = new Posts(content, description, filePath, tags, title, user, isPublished);
            Posts savedPost = postService.savePost(post);

            // Response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Post created successfully with image: " + filePath);
            response.put("id", savedPost.getId());

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error uploading image or saving post"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updatePost(
            @PathVariable Integer id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("content") String content,
            @RequestParam(value = "isPublished", defaultValue = "false") boolean isPublished,
            @RequestParam("userId") Integer userId,
            @RequestParam("description") String description,
            @RequestParam("title") String title,
            @RequestParam(value = "tags", required = false) Set<Integer> tagIds) {

        try {
            Posts post = postService.getPostById(id)
                    .orElseThrow(() -> new RuntimeException("Post not found"));

            Users user = usersService.getUserById(userId);
            if (user == null) {
                throw new RuntimeException("User not found");
            }

            Set<Tags> tags = new HashSet<>(tagService.getTagsByIds(tagIds));

            String filePath = post.getImageUrl();
            if (file != null && !file.isEmpty()) {
                if (filePath != null) {
                    Path oldFile = Paths.get(uploadDir).resolve(filePath);
                    Files.deleteIfExists(oldFile);
                }
                filePath = saveImage(file);
            }

            post.setContent(content);
            post.setDescription(description);
            post.setImageUrl(filePath);
            post.setTags(tags);
            post.setTitle(title);
            post.setUser(user);
            post.setIsPublished(isPublished);

            postService.savePost(post);

            return ResponseEntity.ok("Post updated successfully with image: " + filePath);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating image or saving post");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + ex.getMessage());
        }
    }

    private String saveImage(MultipartFile file) throws IOException, NoSuchAlgorithmException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        String hashedName = hashFileName(originalName + System.currentTimeMillis()) + extension;
        Path filePath = uploadPath.resolve(hashedName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return hashedName;
    }

    private String hashFileName(String input) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(input.getBytes());
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            hexString.append(String.format("%02x", b));
        }
        return hexString.toString();
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public String deletePost(@PathVariable Integer id) {
        postService.deletePost(id);
        return "deleted post";
    }
}
