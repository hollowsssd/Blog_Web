package com.example.Blog.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Blog.model.Users;
import com.example.Blog.repository.UserRepository;

@Service
public class UsersService {

    @Autowired
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<Users> getUsersById(int id) {
        return userRepository.findById(id);
    }

    public Optional<Users> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Users saveUsers(Users users) {
        return userRepository.save(users);
    }

    public void deleteUsers(int id) {
        userRepository.deleteById(id);
    }

    // ✅ Phương thức kiểm tra email tồn tại
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public Users register(Users users) {
        if (userRepository.existsByEmail(users.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng.");
        }

        String encodedPassword = passwordEncoder.encode(users.getPassword());
        users.setPassword(encodedPassword);

        return userRepository.save(users);
    }
}
