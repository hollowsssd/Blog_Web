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
@Table(name = "comment_likes")
@IdClass(CommentLikesId.class)
public class CommentLikes {
    @Getter@Setter
    @Id
    private Integer userId;

    @Id
    private Integer commentId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public CommentLikes() {}

    public CommentLikes(Integer userId, Integer commentId, LocalDateTime createdAt) {
        this.userId = userId;
        this.commentId = commentId;
        this.createdAt = createdAt;
    }


}
