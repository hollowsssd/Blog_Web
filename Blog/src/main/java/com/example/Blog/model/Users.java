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

  @Column (name="name")
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

  public Users(Boolean admin, String avatarUrl, Boolean banned, String email,
      String password, String name) {
    this.admin = admin;
    this.avatarUrl = avatarUrl;
    this.banned = banned;
    this.email = email;
    this.password = password;
    this.name = name;
  }

}
