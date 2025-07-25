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
@Table(name="users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(nullable=false, unique=true)
    private String email;
    @Column(nullable=false)
    private String password;
    
    private Boolean admin;

    @Column(name="created_at")
    private LocalDateTime createdAt;
    
    // @Column(name="banned")
    // private Boolean banned;
    
    // @Column(name="avatar")
    // private String avatarUrl;



    
      public Users(){}

    public Users(String password, Boolean admin, LocalDateTime createdAt, String email) {
        this.password = password;
        this.admin = admin;
        // this.avatarUrl = avatarUrl;
        // this.banned = banned;
        this.createdAt = createdAt;
        this.email = email;
    }

    


    





}
