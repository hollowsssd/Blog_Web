package com.example.Blog.service;

import java.util.List;

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


    


}
