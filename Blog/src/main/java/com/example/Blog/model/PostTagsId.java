package com.example.Blog.model;

import java.io.Serializable;
import java.util.Objects;

public class PostTagsId implements Serializable {
    private Integer postId;
    private Integer tagsId;


    public PostTagsId() {}

    public PostTagsId(Integer postId, Integer tagsId) {
        this.postId = postId;
        this.tagsId = tagsId;
    }

    // equals & hashCode (bắt buộc)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PostTagsId)) return false;
        PostTagsId that = (PostTagsId) o;
        return Objects.equals(postId, that.postId) &&
                Objects.equals(tagsId, that.tagsId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(postId, tagsId);
    }
}
