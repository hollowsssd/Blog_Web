package com.example.Blog.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import com.example.Blog.repository.UserRepository;
import com.example.Blog.service.UsersService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*") // Cho phép gọi từ frontend khác domain (ví dụ: React/Next.js)
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UsersService usersService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<Users> getAllUsers() {
        return usersService.getAllUsers();
    }
    @GetMapping("/chart")
    public List<Map<String, Object>> getUsersChart() {
        return userRepository.getUsersByMonth();
    }

    @GetMapping("/findUser/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        if (!usersService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Người dùng không tồn tại!"));
        }

        Users user = usersService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/add")
    public ResponseEntity<?> saveUsers(@RequestBody Users user) {
        // System.out.println("Received user: " + user.getEmail());

        if (usersService.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email đã tồn tại!"));
        }

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        usersService.saveUsers(user);

        return ResponseEntity.ok(Map.of("message", "Thêm người dùng thành công!"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        if (!usersService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Người dùng không tồn tại!"));
        }

        usersService.deleteUserById(id);
        return ResponseEntity.ok(Map.of("message", "Xoá người dùng thành công!"));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody Users updatedUser) {
        if (!usersService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Người dùng không tồn tại!"));
        }

        Users existingUser = usersService.getUserById(id);

        // Cập nhật thông tin
        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());

        // Nếu có mật khẩu mới thì mã hóa và lưu
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            String encodedPassword = passwordEncoder.encode(updatedUser.getPassword());
            existingUser.setPassword(encodedPassword);
        }

        // Vai trò (Admin/User)

        usersService.saveUsers(existingUser);
        return ResponseEntity.ok(Map.of("message", "Cập nhật người dùng thành công!"));
    }

    @GetMapping("/search")
    public List<Users> searchUsers(@RequestParam("name") String keyword) {
        return usersService.searchUsers(keyword);
    }

    @PutMapping("/ban/{id}")
    public ResponseEntity<?> banUser(@PathVariable Integer id) {
        Optional<Users> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Người dùng không tồn tại!"));
        }

        Users user = optionalUser.get();
        user.setBanned(true); // Ban user
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Đã ban người dùng"));
        
    }

    @PutMapping("/unban/{id}")
    public ResponseEntity<?> unbanUser(@PathVariable Integer id) {
        Optional<Users> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Người dùng không tồn tại!"));
        }

        Users user = optionalUser.get();
        user.setBanned(false); // Mở ban user
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Đã mở ban người dùng"));
    }

}