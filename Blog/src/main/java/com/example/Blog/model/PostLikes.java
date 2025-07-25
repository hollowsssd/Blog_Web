package com.example.Blog.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "post_likes")
@IdClass(PostLikesId.class)

public class PostLikes {
    @Getter@Setter
    @Id
    private Integer userId;

    @Id
    private Integer postId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public PostLikes() {}

    public PostLikes(Integer userId, Integer postId, LocalDateTime createdAt) {
        this.userId = userId;
        this.postId = postId;
        this.createdAt = createdAt;
    }

}

