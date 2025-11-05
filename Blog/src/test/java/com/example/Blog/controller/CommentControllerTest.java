package com.example.Blog.controller;

import com.example.Blog.controller.CommentController.CommentRequest;
import com.example.Blog.model.Comment;
import com.example.Blog.model.Posts;
import com.example.Blog.model.Users;
import com.example.Blog.repository.PostRepository;
import com.example.Blog.repository.UserRepository;
import com.example.Blog.service.CommentService;
import com.example.Blog.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class CommentControllerTest {

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private PostRepository postRepository;

    @MockBean
    private CommentService commentService;

    @Autowired
    private CommentController commentController;

    private Users mockUser;
    private Posts mockPost;

    @BeforeEach
    void setUp() {
        mockUser = new Users();
        mockUser.setId(1);
        mockPost = new Posts();
        mockPost.setId(1);
    }

    @Test
    void createComment_Success() {
        String authHeader = "Bearer valid-token";
        CommentController.CommentRequest request = new CommentController.CommentRequest(1, 1, "Nội dung bình luận");

        when(jwtService.extract(anyString())).thenReturn("1");
        when(userRepository.findById(1)).thenReturn(Optional.of(mockUser));
        when(postRepository.findById(1)).thenReturn(Optional.of(mockPost));

        Comment savedComment = new Comment("Nội dung bình luận", mockUser, mockPost);
        when(commentService.saveComment(any(Comment.class))).thenReturn(savedComment);

        ResponseEntity<?> response = commentController.createComment(request, authHeader);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody() instanceof Comment);
        Comment returnedComment = (Comment) response.getBody();
        assertEquals("Nội dung bình luận", returnedComment.getContent());
        assertEquals(mockUser, returnedComment.getUser());
        assertEquals(mockPost, returnedComment.getPost());
    }

    @Test
    void createComment_Unauthorized_NoAuthHeader() {
        CommentController.CommentRequest request = new CommentController.CommentRequest(1, 1, "Bình luận");

        ResponseEntity<?> response = commentController.createComment(request, null);

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Bạn chưa đăng nhập.", response.getBody());
    }

    @Test
    void createComment_Unauthorized_InvalidToken() {
        String authHeader = "Bearer invalid-token";
        CommentController.CommentRequest request = new CommentController.CommentRequest(1, 1, "Bình luận");

        when(jwtService.extract("invalid-token")).thenThrow(new RuntimeException("Invalid token"));

        ResponseEntity<?> response = commentController.createComment(request, authHeader);

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Token không hợp lệ.", response.getBody());
    }

    @Test
    void createComment_BadRequest_EmptyContent() {
        String authHeader = "Bearer valid-token";
        CommentController.CommentRequest request = new CommentController.CommentRequest(1, 1, "    ");

        when(jwtService.extract(anyString())).thenReturn("1");

        ResponseEntity<?> response = commentController.createComment(request, authHeader);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Nội dung bình luận không được để trống.", response.getBody());
    }

    @Test
    void createComment_BadRequest_TooLongContent() {
        String authHeader = "Bearer valid-token";
        String longContent = "a".repeat(10001);
        CommentController.CommentRequest request = new CommentController.CommentRequest(1, 1, longContent);

        when(jwtService.extract(anyString())).thenReturn("1");

        ResponseEntity<?> response = commentController.createComment(request, authHeader);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Nội dung bình luận vượt quá 10.000 ký tự.", response.getBody());
    }

    @Test
    void createComment_BadRequest_UserOrPostNotExist() {
        String authHeader = "Bearer valid-token";
        CommentController.CommentRequest request = new CommentController.CommentRequest(99, 99, "Bình luận");

        when(jwtService.extract(anyString())).thenReturn("1");
        when(userRepository.findById(99)).thenReturn(Optional.empty());
        when(postRepository.findById(99)).thenReturn(Optional.empty());

        ResponseEntity<?> response = commentController.createComment(request, authHeader);

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("User hoặc Post không tồn tại.", response.getBody());
    }
}
