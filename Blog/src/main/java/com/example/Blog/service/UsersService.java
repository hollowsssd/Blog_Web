package com.example.Blog.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Blog.model.Users;
import com.example.Blog.repository.UserRepository;

@Service
public class UsersService {
    @Autowired
    private UserRepository userRepository;

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<Users> getUsersById(int id) {
        return userRepository.findById(id);
    }

    public Users saveUsers(Users users) {
        return userRepository.save(users);
    }

    public void deleteUsers(int id) {
        userRepository.deleteById(id);
    }

}
