package com.example.Blog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

    @PutMapping("/edit/{id}")
    public String editUser(@PathVariable Integer id, @RequestBody Users users) {
        users.setId(id);
        usersService.saveUsers(users);
        return "user updated";
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUsers(@PathVariable Integer id) {
        usersService.deleteUsers(id);
        return "user deleted";
    }

      @GetMapping("/search")
    public List<Users> searchUsers(@RequestParam("name") String keyword) {
        return usersService.searchUsers(keyword);
    }

}
