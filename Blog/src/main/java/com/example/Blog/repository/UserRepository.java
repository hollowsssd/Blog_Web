package com.example.Blog.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.Blog.model.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {
        Optional<Users> findByEmail(String email);
        List<Users> findByNameContaining(String Keyword);
        boolean existsByEmail(String email); // ← Câu lệnh kiểm tra
}
