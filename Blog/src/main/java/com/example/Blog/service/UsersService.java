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

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<Users> getUsersById(Integer id) {
        return userRepository.findById(id);
    }

    public Optional<Users> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public Users saveUsers(Users users) {
        return userRepository.save(users);
    }

    public void deleteUsers(Integer id) {
        userRepository.deleteById(id);
    }

    public Users register(String name, String email, String rawPassword) {
        String encodedPassword = passwordEncoder.encode(rawPassword);
        Users user = new Users();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }

    public boolean existsById(Integer id) {
        return userRepository.existsById(id);
    }

    public void deleteUserById(Integer id) {
        userRepository.deleteById(id);
    }

    public Users getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));
    }

    public List<Users> searchUsers(String keyword) {
        return userRepository.findByNameContaining(keyword);
    }

}
