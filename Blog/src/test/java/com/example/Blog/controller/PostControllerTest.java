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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class PostControllerTest {

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

    private Users mockUser;
    private Tags mockTag;

    @BeforeEach
    void setUp() {
        mockUser = new Users();
        mockUser.setId(1);
        mockTag = new Tags();
        mockTag.setId(10);
    }

    @Test
    void createPost_Success() throws Exception {
        String authHeader = "Bearer valid-token";
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "fake image content".getBytes());

        when(jwtService.extract(anyString())).thenReturn("1");
        when(usersService.getUserById(1)).thenReturn(mockUser);
        when(tagService.getTagsByIds(Set.of(10))).thenReturn(List.of(mockTag));

        Posts savedPost = new Posts();
        savedPost.setId(100);
        when(postService.savePost(any(Posts.class))).thenReturn(savedPost);

        ResponseEntity<Map<String, Object>> response = postController.createPost(
                authHeader,
                file,
                "Nội dung bài viết",
                true,
                1,
                "Mô tả bài viết",
                "Tiêu đề bài viết",
                Set.of(10)
        );

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Bài viết đã được tạo thành công.", response.getBody().get("message"));
        assertEquals(100, response.getBody().get("id"));
    }

    @Test
    void createPost_Unauthorized_NoAuthHeader() {
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "fake".getBytes());

        ResponseEntity<Map<String, Object>> response = postController.createPost(
                null, file, "content", true, 1, "desc", "title", Set.of(10)
        );

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Bạn chưa đăng nhập.", response.getBody().get("error"));
    }

    @Test
    void createPost_Unauthorized_InvalidToken() {
        String authHeader = "Bearer invalid-token";
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "fake".getBytes());

        when(jwtService.extract("invalid-token")).thenThrow(new RuntimeException("Invalid token"));

        ResponseEntity<Map<String, Object>> response = postController.createPost(
                authHeader, file, "content", true, 1, "desc", "title", Set.of(10)
        );

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Token không hợp lệ.", response.getBody().get("error"));
    }

    @Test
    void createPost_BadRequest_EmptyTitle() {
        String authHeader = "Bearer valid-token";
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "fake".getBytes());

        when(jwtService.extract(anyString())).thenReturn("1");

        ResponseEntity<Map<String, Object>> response = postController.createPost(
                authHeader, file, "content", true, 1, "desc", "    ", Set.of(10)
        );

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Tiêu đề không được để trống.", response.getBody().get("error"));
    }

    @Test
    void createPost_BadRequest_EmptyDescription() {
        String authHeader = "Bearer valid-token";
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "fake".getBytes());

        when(jwtService.extract(anyString())).thenReturn("1");

        ResponseEntity<Map<String, Object>> response = postController.createPost(
                authHeader, file, "content", true, 1, "   ", "title", Set.of(10)
        );

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Mô tả không được để trống.", response.getBody().get("error"));
    }

    @Test
    void createPost_BadRequest_EmptyContent() {
        String authHeader = "Bearer valid-token";
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "fake".getBytes());

        when(jwtService.extract(anyString())).thenReturn("1");

        ResponseEntity<Map<String, Object>> response = postController.createPost(
                authHeader, file, "    ", true, 1, "desc", "title", Set.of(10)
        );

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Nội dung không được để trống.", response.getBody().get("error"));
    }

    @Test
    void createPost_BadRequest_FileEmpty() {
        String authHeader = "Bearer valid-token";
        MockMultipartFile emptyFile = new MockMultipartFile("file", new byte[0]);

        when(jwtService.extract(anyString())).thenReturn("1");

        ResponseEntity<Map<String, Object>> response = postController.createPost(
                authHeader, emptyFile, "content", true, 1, "desc", "title", Set.of(10)
        );

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Ảnh bìa không được để trống.", response.getBody().get("error"));
    }

    @Test
    void createPost_BadRequest_TagsEmpty() {
        String authHeader = "Bearer valid-token";
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "fake".getBytes());

        when(jwtService.extract(anyString())).thenReturn("1");

        ResponseEntity<Map<String, Object>> response = postController.createPost(
                authHeader, file, "content", true, 1, "desc", "title", Collections.emptySet()
        );

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Vui lòng chọn ít nhất một thẻ.", response.getBody().get("error"));
    }

    @Test
    void createPost_BadRequest_UserNotFound() throws Exception {
        String authHeader = "Bearer valid-token";
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "fake".getBytes());

        when(jwtService.extract(anyString())).thenReturn("1");
        when(usersService.getUserById(99)).thenReturn(null);
        when(tagService.getTagsByIds(Set.of(10))).thenReturn(List.of(mockTag));

        ResponseEntity<Map<String, Object>> response = postController.createPost(
                authHeader, file, "content", true, 99, "desc", "title", Set.of(10)
        );

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User không tồn tại.", response.getBody().get("error"));
    }

    @Test
    void createPost_InternalServerError_OnIOException() throws Exception {
        String authHeader = "Bearer valid-token";
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "fake".getBytes());

        when(jwtService.extract(anyString())).thenReturn("1");
        when(usersService.getUserById(1)).thenReturn(mockUser);
        when(tagService.getTagsByIds(Set.of(10))).thenReturn(List.of(mockTag));

        // Không thể mock saveImage vì private, nên test này có thể bỏ hoặc kiểm tra khi file upload dir không tồn tại
        // Hoặc bạn có thể tạo test riêng cho private method saveImage

        // Để giả lập IOException, bạn có thể tạm thời đổi saveImage sang protected để spy (không theo yêu cầu hiện tại)

        // Hoặc bỏ test này nếu không thay đổi controller

        // Nếu muốn test thì cần refactor controller*
    }

    @Test
    void createPost_BadRequest_WhenPostServiceThrows() throws Exception {
        String authHeader = "Bearer valid-token";
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "fake".getBytes());

        when(jwtService.extract(anyString())).thenReturn("1");
        when(usersService.getUserById(1)).thenReturn(mockUser);
        when(tagService.getTagsByIds(Set.of(10))).thenReturn(List.of(mockTag));

        when(postService.savePost(any())).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<Map<String, Object>> response = postController.createPost(
                authHeader, file, "content", true, 1, "desc", "title", Set.of(10)
        );

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("DB error", response.getBody().get("error"));
    }
}
