package com.example.Blog.model;

import java.io.Serializable;
import java.util.Objects;

public class PostLikesId implements Serializable {
    private Integer userId;
    private Integer postId;

   
    public PostLikesId() {}

    public PostLikesId(Integer userId, Integer postId) {
        this.userId = userId;
        this.postId = postId;
    }

    // equals & hashCode (bắt buộc)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PostLikesId)) return false;
        PostLikesId that = (PostLikesId) o;
        return Objects.equals(userId, that.userId) &&
               Objects.equals(postId, that.postId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, postId);
    }
}
