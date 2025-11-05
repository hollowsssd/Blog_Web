package com.example.Blog.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest; // <—
import org.springframework.boot.test.mock.mockito.  MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.Blog.model.Users;
import com.example.Blog.service.JwtService;
import com.example.Blog.service.UsersService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // 🔥 TẮT SECURITY FILTER TRONG TEST
public class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    UsersService usersService;

    @MockBean
    PasswordEncoder passwordEncoder;

    @MockBean
    JwtService jwtService;

    // ====== LOGIN: SUCCESS ======
    @Test
    void testLoginSuccess() throws Exception {
        Users mockUser = new Users();
        mockUser.setId(1);
        mockUser.setName("Test User");
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("encodedPass");
        mockUser.setAdmin(false);
        mockUser.setBanned(false);
        mockUser.setCreatedAt(LocalDateTime.now());

        when(usersService.findByEmail("test@example.com")).thenReturn(mockUser);
        when(passwordEncoder.matches("123456", "encodedPass")).thenReturn(true);
        when(jwtService.generateToken(
                anyInt(),
                anyString(),
                anyString(),
                anyBoolean(),
                anyString())).thenReturn("mocked-jwt-token");

        Map<String, String> payload = Map.of("email", "test@example.com", "password", "123456");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Đăng nhập thành công!"))
                .andExpect(jsonPath("$.Token").value("mocked-jwt-token"));
    }

    // ====== LOGIN: FAIL CASES ======
    @Test
    void testLoginMissingFields() throws Exception {
        Map<String, String> payload = Map.of("email", "", "password", "");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email, Password không được để trống"))
                .andDo(print());
    }

    @Test
    void testLoginInvalidEmailFormat() throws Exception {
        Map<String, String> payload = Map.of("email", "invalid-email", "password", "123456");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email không hợp lệ."));
    }

    @Test
    void testLoginShortPassword() throws Exception {
        Map<String, String> payload = Map.of("email", "test@example.com", "password", "123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Mật khẩu phải có ít nhất 6 ký tự."));
    }

    @Test
    void testLoginWrongPassword() throws Exception {
        Users mockUser = new Users();
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("encodedPass");
        mockUser.setBanned(false);

        when(usersService.findByEmail("test@example.com")).thenReturn(mockUser);
        when(passwordEncoder.matches("wrongpass", "encodedPass")).thenReturn(false);

        Map<String, String> payload = Map.of("email", "test@example.com", "password", "wrongpass");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email hoặc mật khẩu không đúng!"));
    }

    @Test
    void testLoginBannedUser() throws Exception {
        Users mockUser = new Users();
        mockUser.setEmail("ban@example.com");
        mockUser.setPassword("encodedPass");
        mockUser.setBanned(true);

        when(usersService.findByEmail("ban@example.com")).thenReturn(mockUser);
        when(passwordEncoder.matches("123456", "encodedPass")).thenReturn(true);

        Map<String, String> payload = Map.of("email", "ban@example.com", "password", "123456");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("Tài khoản của bạn đã bị cấm."));
    }

    // ====== REGISTER: SUCCESS ======
    @Test
    void testRegisterSuccess() throws Exception {
        Users newUser = new Users();
        newUser.setId(2);
        newUser.setName("New User");
        newUser.setEmail("new@example.com");

        when(usersService.existsByEmail("new@example.com")).thenReturn(false);
        when(usersService.register(eq("New User"), eq("new@example.com"), eq("123456"))).thenReturn(newUser);

        Map<String, String> payload = Map.of("name", "New User", "email", "new@example.com", "password", "123456");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Đăng ký thành công!"))
                .andExpect(jsonPath("$.user.name").value("New User"))
                .andExpect(jsonPath("$.user.email").value("new@example.com"));
    }

    // ====== REGISTER: FAIL CASES ======
    @Test
    void testRegisterMissingFields() throws Exception {
        Map<String, String> payload = Map.of("name", "", "email", "", "password", "");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Tên, Email, Password không được để trống"));
    }

    @Test
    void testRegisterInvalidEmail() throws Exception {
        Map<String, String> payload = Map.of("name", "New User", "email", "invalid", "password", "123456");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email không hợp lệ."));
    }

    @Test
    void testRegisterShortPassword() throws Exception {
        Map<String, String> payload = Map.of("name", "New User", "email", "new@example.com", "password", "123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Mật khẩu phải có ít nhất 6 ký tự."));
    }

    @Test
    void testRegisterEmailExists() throws Exception {
        when(usersService.existsByEmail("dup@example.com")).thenReturn(true);

        Map<String, String> payload = Map.of("name", "New User", "email", "dup@example.com", "password", "123456");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email đã được sử dụng."));
    }
}
