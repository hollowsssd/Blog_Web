package com.example.Blog.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@IdClass(PostLikesId.class)
public class PostLikes {

    @Id
    @JoinColumn(name = "user_id", nullable = false)
    private Integer userId;

    @Id
    @JoinColumn(name = "post_id", nullable = false)
    private Integer postId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public PostLikes() {}

    public PostLikes(Integer userId, Integer postId) {
        this.userId = userId;
        this.postId = postId;
    }

    
}
