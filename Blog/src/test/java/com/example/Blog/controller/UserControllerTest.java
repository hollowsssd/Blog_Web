package com.example.Blog.controller;

import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.Mockito;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.Blog.model.Users;
import com.example.Blog.repository.UserRepository;
import com.example.Blog.service.UsersService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(controllers = UserController.class, excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {
        com.example.Blog.config.SecurityConfig.class,
        com.example.Blog.config.Jwtfilter.class } // đổi package/class đúng của m
))
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    MockMvc mockMvc;
    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    UsersService usersService;
    @MockBean
    UserRepository userRepository;
    @MockBean
    PasswordEncoder passwordEncoder;

    // ===== UPDATE: success không đổi password =====
    @Test
    void updateUser_success_noPassword() throws Exception {
        Integer id = 10;
        Users existing = new Users();
        existing.setId(id);
        existing.setName("Old");
        existing.setEmail("old@mail.com");
        existing.setAdmin(false);
        existing.setPassword("keep-encoded");

        Mockito.when(usersService.existsById(id)).thenReturn(true);
        Mockito.when(usersService.getUserById(id)).thenReturn(existing);

        Map<String, Object> payload = Map.of(
                "name", "New Name",
                "email", "new@mail.com",
                "admin", true
                // không gửi password
        );

        mockMvc.perform(put("/api/user/update/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Cập nhật người dùng thành công!"));

        // verify flow
        verify(usersService).saveUsers(existing);
        verify(passwordEncoder, never()).encode(anyString()); // không encode vì không đổi pass
    }

    // ===== UPDATE: success có đổi password =====
    @Test
    void updateUser_success_withPassword() throws Exception {
        Integer id = 11;
        Users existing = new Users();
        existing.setId(id);
        existing.setName("Old");
        existing.setEmail("old@mail.com");
        existing.setAdmin(false);
        existing.setPassword("old-encoded");

        Mockito.when(usersService.existsById(id)).thenReturn(true);
        Mockito.when(usersService.getUserById(id)).thenReturn(existing);
        Mockito.when(passwordEncoder.encode("newpass")).thenReturn("new-encoded");

        Map<String, Object> payload = Map.of(
                "name", "New Name",
                "email", "new@mail.com",
                "admin", true,
                "password", "newpass");

        mockMvc.perform(put("/api/user/update/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Cập nhật người dùng thành công!"));

        verify(passwordEncoder).encode("newpass");
        verify(usersService).saveUsers(existing);
    }

    // ===== UPDATE: not found =====
    @Test
    void updateUser_notFound() throws Exception {
        Integer id = 99;
        Mockito.when(usersService.existsById(id)).thenReturn(false);

        Map<String, Object> payload = Map.of(
                "name", "Any",
                "email", "any@mail.com",
                "admin", false);

        mockMvc.perform(put("/api/user/update/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Người dùng không tồn tại!"));
    }

    // ===== BAN: success =====
    @Test
    void banUser_success() throws Exception {
        Integer id = 5;
        Users u = new Users();
        u.setId(id);
        u.setBanned(false);

        Mockito.when(userRepository.findById(id)).thenReturn(Optional.of(u));

        mockMvc.perform(put("/api/user/ban/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Đã ban người dùng"));

        verify(userRepository).save(u);
    }

    // ===== BAN: not found =====
    @Test
    void banUser_notFound() throws Exception {
        Integer id = 404;
        Mockito.when(userRepository.findById(id)).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/user/ban/{id}", id))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Người dùng không tồn tại!"));
    }
}


