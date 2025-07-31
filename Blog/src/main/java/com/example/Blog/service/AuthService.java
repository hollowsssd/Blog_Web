package com.example.Blog.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Blog.model.Users;
import com.example.Blog.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public Users login(String email, String rawPassword) {
        Users user = userRepository.findByEmail(email);

        if (user == null) {
            return null; // Không tìm thấy người dùng
        }

        if (Boolean.TRUE.equals(user.getBanned())) {
            return null; // Người dùng bị ban
        }

        // Kiểm tra password (plain text)
        if (user.getPassword().equals(rawPassword)) {
            return user; // Đăng nhập thành công
        }

        return null; // Sai mật khẩu
    }

    public boolean isBanned(String email) {
        Users user = userRepository.findByEmail(email);
        return user != null && Boolean.TRUE.equals(user.getBanned());
    }
}
