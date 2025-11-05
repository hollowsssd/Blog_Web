package com.example.Blog.controller;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import com.example.Blog.repository.TagsRepository;
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
import com.example.Blog.service.JwtService;

@RestController
@RequestMapping("/post")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private UsersService usersService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private TagService tagService;

    @Autowired
    private TagsRepository tagsRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @GetMapping
    public List<Posts> getAllPosts(@RequestParam(defaultValue = "latest") String sort) {
        if (sort.equalsIgnoreCase("top")) {
            return postService.getPostsSortedByLikes();
        } else {
            return postService.getAllPostsSortedByDate();
        }
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
    public ResponseEntity<?> getPostsByTag(@PathVariable Integer tagId) {
        if (!tagsRepository.existsById(tagId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Tag không tồn tại!"));
        }

        List<Posts> posts = postService.getPostsByTagId(tagId);
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> createPost(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam("file") MultipartFile file,
            @RequestParam("content") String content,
            @RequestParam(value = "isPublished", defaultValue = "false") boolean isPublished,
            @RequestParam("userId") Integer userId,
            @RequestParam("description") String description,
            @RequestParam("title") String title,
            @RequestParam(value = "tags", required = false) Set<Integer> tagIds) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Bạn chưa đăng nhập."));
        }

        String token = authHeader.substring(7); // Bỏ "Bearer "
        try {
            jwtService.extract(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Token không hợp lệ."));
        }

        if (title.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Tiêu đề không được để trống."));
        }
        if (description.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mô tả không được để trống."));
        }
        if (content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nội dung không được để trống."));
        }
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ảnh bìa không được để trống."));
        }
        if (tagIds == null || tagIds.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Vui lòng chọn ít nhất một thẻ."));
        }

        try {
            String filePath = saveImage(file);

            Users user = usersService.getUserById(userId);
            if (user == null) {
                throw new RuntimeException("User không tồn tại.");
            }

            Set<Tags> tags = new HashSet<>(tagService.getTagsByIds(tagIds));

            Posts post = new Posts(content.trim(), description.trim(), filePath, tags, title.trim(), user, isPublished);
            Posts savedPost = postService.savePost(post);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Bài viết đã được tạo thành công.");
            response.put("id", savedPost.getId());

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi tải ảnh hoặc lưu bài viết."));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        }
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<String> updatePost(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Integer id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("content") String content,
            @RequestParam(value = "isPublished", defaultValue = "false") boolean isPublished,
            @RequestParam("userId") Integer userId,
            @RequestParam("description") String description,
            @RequestParam("title") String title,
            @RequestParam(value = "tags", required = false) Set<Integer> tagIds) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Bạn chưa đăng nhập.");
        }

        String token = authHeader.substring(7);
        try {
            jwtService.extract(token);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Token không hợp lệ.");
        }

        if (title.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Tiêu đề không được để trống.");
        }
        if (description.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Mô tả không được để trống.");
        }
        if (content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Nội dung không được để trống.");
        }
        if (tagIds == null || tagIds.isEmpty()) {
            return ResponseEntity.badRequest().body("Vui lòng chọn ít nhất một thẻ.");
        }

        try {
            Posts post = postService.getPostById(id)
                    .orElseThrow(() -> new RuntimeException("Bài viết không tồn tại."));

            Users user = usersService.getUserById(userId);
            if (user == null) {
                throw new RuntimeException("Người dùng không tồn tại.");
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

            post.setContent(content.trim());
            post.setDescription(description.trim());
            post.setImageUrl(filePath);
            post.setTags(tags);
            post.setTitle(title.trim());
            post.setUser(user);
            post.setIsPublished(isPublished);

            postService.savePost(post);

            return ResponseEntity.ok("✅ Bài viết đã được cập nhật thành công.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi khi cập nhật ảnh hoặc lưu bài viết.");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Lỗi: " + ex.getMessage());
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
