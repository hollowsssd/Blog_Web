package com.example.Blog.controller;

import com.example.Blog.model.Users;
import com.example.Blog.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Cho phép từ frontend gọi đến
public class AuthController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        Users user = usersService.findByEmail(email).orElse(null);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email hoặc mật khẩu không đúng!"));
        }

        // ⚠️ Giả token - bạn có thể thay bằng JWT sau này
        return ResponseEntity.ok(Map.of(
                "message", "Đăng nhập thành công!",
                "user", Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail()
                ),
                "accessToken", "fake-token-123"
        ));
    }
}
