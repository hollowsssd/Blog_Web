package com.example.Blog.model;

import java.io.Serializable;
import java.util.Objects;

public class CommentLikesId implements Serializable {

    private Integer userId;
    private Integer commentId;

    public CommentLikesId() {}

    public CommentLikesId(Integer userId, Integer commentId) {
        this.userId = userId;
        this.commentId = commentId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CommentLikesId)) return false;
        CommentLikesId that = (CommentLikesId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(commentId, that.commentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, commentId);
    }
}
