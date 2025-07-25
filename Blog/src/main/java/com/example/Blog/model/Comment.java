package com.example.Blog.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "comments")
public class Comment {
     @Getter@Setter

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Posts post;

    private String content;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Comment(String content, LocalDateTime createdAt, Integer id, Posts post, Users user) {
        this.content = content;
        this.createdAt = createdAt;
        this.id = id;
        this.post = post;
        this.user = user;
    }
    public Comment(){}

}
