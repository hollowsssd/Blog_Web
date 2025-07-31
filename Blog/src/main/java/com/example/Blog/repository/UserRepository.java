package com.example.Blog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Blog.model.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {
        List<Users> findByNameContaining(String Keyword);
        boolean existsByEmail(String email); // ← Câu lệnh kiểm tra
        List<Users> findByBanned(boolean banned);
        Users findByEmail(String email);

}
