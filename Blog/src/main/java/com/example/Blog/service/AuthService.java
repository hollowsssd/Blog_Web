package com.example.Blog.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Blog.model.Users;
import com.example.Blog.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public Optional<Users> login(String email, String rawPassword) {
        Optional<Users> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) return Optional.empty();

        Users user = userOpt.get();

        if (Boolean.TRUE.equals(user.getBanned())) {
            // Người dùng bị ban, không cho đăng nhập
            return Optional.empty();
        }

        // Kiểm tra password (plain text – nên hash thực tế)
       if (Boolean.TRUE.equals(user.getBanned())) {
    return Optional.empty(); // Không cho login nếu bị ban
}

        return Optional.empty();
    }

    public boolean isBanned(String email) {
        return userRepository.findByEmail(email)
                .map(Users::getBanned)
                .orElse(false);
    }
}