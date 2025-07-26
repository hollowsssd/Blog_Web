package com.example.Blog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity; // ✅ thêm dòng này
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> saveUsers(@RequestBody Users user) {
        System.out.println("Received user: " + user.getEmail());

        // Kiểm tra email đã tồn tại chưa
        if (usersService.existsByEmail(user.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("{\"message\": \"Email đã tồn tại!\"}");
        }

        usersService.saveUsers(user);
        return ResponseEntity.ok("{\"message\": \"Thêm người dùng thành công!\"}");
    }
}
