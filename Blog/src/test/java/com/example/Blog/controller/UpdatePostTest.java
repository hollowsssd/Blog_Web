package com.example.Blog.controller;

import com.example.Blog.model.Posts;
import com.example.Blog.model.Tags;
import com.example.Blog.model.Users;
import com.example.Blog.service.JwtService;
import com.example.Blog.service.PostService;
import com.example.Blog.service.TagService;
import com.example.Blog.service.UsersService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class UpdatePostTest {

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UsersService usersService;

    @MockBean
    private TagService tagService;

    @MockBean
    private PostService postService;

    @Autowired
    private PostController postController;

    @Value("${file.upload-dir}")
    private String uploadDir;

    private Users mockUser;
    private Tags mockTag;
    private Posts existingPost;

    @BeforeEach
    void setUp() {
        mockUser = new Users();
        mockUser.setId(1);

        mockTag = new Tags();
        mockTag.setId(10);

        existingPost = new Posts();
        existingPost.setId(100);
        existingPost.setImageUrl("oldImage.jpg");
    }

    @Test
    void updatePost_Success_WithNewFile() throws IOException {
        String authHeader = "Bearer valid-token";
        MockMultipartFile newFile = new MockMultipartFile("file", "new.jpg", "image/jpeg", "fake image".getBytes());
        Set<Integer> tagIds = Set.of(10);

        when(jwtService.extract(anyString())).thenReturn("1");
        when(postService.getPostById(100)).thenReturn(Optional.of(existingPost));
        when(usersService.getUserById(1)).thenReturn(mockUser);
        when(tagService.getTagsByIds(tagIds)).thenReturn(List.of(mockTag));
        when(postService.savePost(any(Posts.class))).thenReturn(existingPost);

        // We do not mock saveImage because it's private; instead, spy or partial mock can be used,
        // but for simplicity assume the real method or file system exists or mock it differently in integration.

        ResponseEntity<String> response = postController.updatePost(
                authHeader,
                100,
                newFile,
                "Nội dung mới",
                true,
                1,
                "Mô tả mới",
                "Tiêu đề mới",
                tagIds
        );

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("✅ Bài viết đã được cập nhật thành công.", response.getBody());
    }

    @Test
    void updatePost_Success_WithoutNewFile() throws IOException {
        String authHeader = "Bearer valid-token";
        Set<Integer> tagIds = Set.of(10);

        when(jwtService.extract(anyString())).thenReturn("1");
        when(postService.getPostById(100)).thenReturn(Optional.of(existingPost));
        when(usersService.getUserById(1)).thenReturn(mockUser);
        when(tagService.getTagsByIds(tagIds)).thenReturn(List.of(mockTag));
        when(postService.savePost(any(Posts.class))).thenReturn(existingPost);

        ResponseEntity<String> response = postController.updatePost(
                authHeader,
                100,
                null,
                "Nội dung mới",
                false,
                1,
                "Mô tả mới",
                "Tiêu đề mới",
                tagIds
        );

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("✅ Bài viết đã được cập nhật thành công.", response.getBody());
    }

    @Test
    void updatePost_Unauthorized_NoAuthHeader() {
        ResponseEntity<String> response = postController.updatePost(
                null,
                100,
                null,
                "Nội dung",
                false,
                1,
                "Mô tả",
                "Tiêu đề",
                Set.of(10)
        );

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Bạn chưa đăng nhập.", response.getBody());
    }

    @Test
    void updatePost_Unauthorized_InvalidToken() {
        String authHeader = "Bearer invalid-token";

        when(jwtService.extract("invalid-token")).thenThrow(new RuntimeException("Invalid token"));

        ResponseEntity<String> response = postController.updatePost(
                authHeader,
                100,
                null,
                "Nội dung",
                false,
                1,
                "Mô tả",
                "Tiêu đề",
                Set.of(10)
        );

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Token không hợp lệ.", response.getBody());
    }

    @Test
    void updatePost_BadRequest_EmptyTitle() {
        String authHeader = "Bearer valid-token";

        when(jwtService.extract(anyString())).thenReturn("1");

        ResponseEntity<String> response = postController.updatePost(
                authHeader,
                100,
                null,
                "Nội dung",
                false,
                1,
                "Mô tả",
                "   ",
                Set.of(10)
        );

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Tiêu đề không được để trống.", response.getBody());
    }

    @Test
    void updatePost_BadRequest_EmptyDescription() {
        String authHeader = "Bearer valid-token";

        when(jwtService.extract(anyString())).thenReturn("1");

        ResponseEntity<String> response = postController.updatePost(
                authHeader,
                100,
                null,
                "Nội dung",
                false,
                1,
                "   ",
                "Tiêu đề",
                Set.of(10)
        );

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Mô tả không được để trống.", response.getBody());
    }

    @Test
    void updatePost_BadRequest_EmptyContent() {
        String authHeader = "Bearer valid-token";

        when(jwtService.extract(anyString())).thenReturn("1");

        ResponseEntity<String> response = postController.updatePost(
                authHeader,
                100,
                null,
                "   ",
                false,
                1,
                "Mô tả",
                "Tiêu đề",
                Set.of(10)
        );

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Nội dung không được để trống.", response.getBody());
    }

    @Test
    void updatePost_BadRequest_EmptyTags() {
        String authHeader = "Bearer valid-token";

        when(jwtService.extract(anyString())).thenReturn("1");

        ResponseEntity<String> response = postController.updatePost(
                authHeader,
                100,
                null,
                "Nội dung",
                false,
                1,
                "Mô tả",
                "Tiêu đề",
                null
        );

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Vui lòng chọn ít nhất một thẻ.", response.getBody());
    }

    @Test
    void updatePost_BadRequest_PostNotFound() {
        String authHeader = "Bearer valid-token";

        when(jwtService.extract(anyString())).thenReturn("1");
        when(postService.getPostById(100)).thenReturn(Optional.empty());

        ResponseEntity<String> response = postController.updatePost(
                authHeader,
                100,
                null,
                "Nội dung",
                false,
                1,
                "Mô tả",
                "Tiêu đề",
                Set.of(10)
        );

        assertEquals(400, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("Bài viết không tồn tại."));
    }

    @Test
    void updatePost_BadRequest_UserNotFound() {
        String authHeader = "Bearer valid-token";

        when(jwtService.extract(anyString())).thenReturn("1");
        when(postService.getPostById(100)).thenReturn(Optional.of(existingPost));
        when(usersService.getUserById(1)).thenReturn(null);

        ResponseEntity<String> response = postController.updatePost(
                authHeader,
                100,
                null,
                "Nội dung",
                false,
                1,
                "Mô tả",
                "Tiêu đề",
                Set.of(10)
        );

        assertEquals(400, response.getStatusCodeValue());
        assertTrue(response.getBody().contains("Người dùng không tồn tại."));
    }


}

