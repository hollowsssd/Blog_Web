package com.example.Blog.controller;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.Blog.model.Posts;
import com.example.Blog.model.Tags;
import com.example.Blog.model.Users;
import com.example.Blog.service.PostService;
import com.example.Blog.service.TagService;
import com.example.Blog.service.UsersService;

@RestController // đổi sang RestController để trả JSON
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;
    @Autowired
    private UsersService usersService;
    @Autowired
    private TagService tagService;

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

    // add
    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/add")
    public ResponseEntity<String> createPost(
            @RequestParam("file") MultipartFile file,
            @RequestParam("content") String content,
            @RequestParam(value = "isPublished", defaultValue = "false") boolean isPublished,
            @RequestParam("userId") Integer userId,
            @RequestParam("description") String description,
            @RequestParam("title") String title,
            @RequestParam(value = "tags", required = false) Set<Integer> tagIds) {
        try {
            // Lưu file ảnh
            String filePath = saveImage(file);

            // Lấy user
            Users user = usersService.getUserById(userId);
            if (user == null) {
                throw new RuntimeException("User not found");
            }

            // Lấy tags nếu có
            Set<Tags> tags = new HashSet<>(tagService.getTagsByIds(tagIds));

            // Dùng constructor
            Posts post = new Posts(content, description, filePath, tags, title, user, isPublished);
            postService.savePost(post);

            return ResponseEntity.ok("Post created successfully with image: " + filePath);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading image or saving post");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + ex.getMessage());
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
            // Tìm post
            Posts post = postService.getPostById(id)
                    .orElseThrow(() -> new RuntimeException("Post not found"));

            // Lấy user
            Users user = usersService.getUserById(userId);
            if (user == null) {
                throw new RuntimeException("User not found");
            }

            // Lấy tags nếu có
            Set<Tags> tags = new HashSet<>(tagService.getTagsByIds(tagIds));

            // Nếu có file mới -> xóa file cũ + lưu lại file mới
            String filePath = post.getImageUrl();
            if (file != null && !file.isEmpty()) {
                // Xóa file cũ nếu tồn tại
                if (filePath != null) {
                    Path oldFile = Paths.get(uploadDir).resolve(filePath);
                    Files.deleteIfExists(oldFile);
                }
                // Lưu file mới
                filePath = saveImage(file);
            }

            // Update các field
            post.setContent(content);
            post.setDescription(description);
            post.setImageUrl(filePath);
            post.setTags(tags);
            post.setTitle(title);
            post.setUser(user);
            post.setIsPublished(isPublished);

            // Lưu lại DB
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

        // Lấy phần mở rộng file (jpg, png...)
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }

        // Hash tên file để tránh trùng
        String hashedName = hashFileName(originalName + System.currentTimeMillis()) + extension;

        // Lưu file
        Path filePath = uploadPath.resolve(hashedName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return hashedName; // Trả về tên file mới
    }

    // // Hàm hash tên file SHA-256
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

    // save

    @PutMapping("edit/{id}")
    public String editPost(@PathVariable Integer id, @RequestBody String entity) {
        // TODO: process PUT request

        return entity;
    }

    @DeleteMapping("/delete/{id}")
    public String deletePost(@PathVariable Integer id) {
        postService.deletePost(id);
        return "deleted post";
    }
}
