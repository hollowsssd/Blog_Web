package com.example.Blog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Blog.model.Users;
import com.example.Blog.service.UsersService;


@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UsersService usersService;

    @GetMapping
    public List<Users> getAllUsers() {
        return usersService.getAllUsers();
    }

    @PostMapping("/add")
    public String saveUsers(@RequestBody Users user) {
        System.out.println("hello dcm");
        usersService.saveUsers(user);
        System.out.println("Received user: " + user.getEmail());  // ← check có null ko
        System.out.println("user: " + user);
        return "user added successfully!";
    }

}
