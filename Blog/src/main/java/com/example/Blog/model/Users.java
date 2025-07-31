package com.example.Blog.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class Users {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password;

  @Column(name = "name")
  private String name;

  @Column(nullable = false)
  private Boolean admin = false; // mặc định là user

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt = LocalDateTime.now(); // tự set khi tạo

  @Column(name = "banned", nullable = false)
  private Boolean banned = false;

  @Column(name = "avatar")
  private String avatarUrl;

  public Users() {
  }

  public Users(String avatarUrl, String email, String name, String password) {
    this(avatarUrl, email, name, password, false, false); // gọi constructor đầy đủ
  }

  public Users(String avatarUrl, String email, String name, String password, Boolean admin, Boolean banned) {
    this.avatarUrl = avatarUrl;
    this.email = email;
    this.name = name;
    this.password = password;
    this.admin = admin != null ? admin : false;
    this.banned = banned != null ? banned : false;
  }


  
}
