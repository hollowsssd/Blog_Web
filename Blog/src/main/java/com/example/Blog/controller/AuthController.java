package com.example.Blog.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.Blog.model.Users;
import com.example.Blog.service.UsersService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Cho phép gọi từ frontend
public class AuthController {

    @Autowired
    private UsersService usersService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        Users user = usersService.findByEmail(email).orElse(null);

        // Kiểm tra không tồn tại hoặc sai mật khẩu
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email hoặc mật khẩu không đúng!"));
        }

        // Kiểm tra nếu bị ban
        if (user.getBanned() == true ) {
            return ResponseEntity.status(403).body(Map.of("message", "Tài khoản của bạn đã bị cấm."));
        }

        return ResponseEntity.ok(Map.of(
                "message", "Đăng nhập thành công!",
                "user", Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "admin", user.getAdmin(),
                        "banned", user.getBanned()),
                "accessToken", "fake-token-123" // TODO: Thay bằng JWT sau này
        ));
    }

    // Đăng ký
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String password = payload.get("password");

        if (usersService.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email đã được sử dụng."));
        }

        Users newUser = usersService.register(name, email, password);
        return ResponseEntity.ok(Map.of(
                "message", "Đăng ký thành công!",
                "user", Map.of(
                        "id", newUser.getId(),
                        "name", newUser.getName(),
                        "email", newUser.getEmail())));
    }
}
