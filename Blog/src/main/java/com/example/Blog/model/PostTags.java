package com.example.Blog.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "post_tags")
@IdClass(PostTagsId.class)
public class PostTags {

    @Id
    @Column(name = "post_id", nullable = false)
    private Integer postId;

    @Id
    @Column(name = "tags_id", nullable = false)
    private Integer tagsId;

    public PostTags() {}

    public PostTags(Integer postId, Integer tagsId) {
        this.postId = postId;
        this.tagsId = tagsId;
    }
}
