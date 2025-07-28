package com.example.Blog.model;

import java.time.LocalDateTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "posts")
public class Posts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Quan hệ 1-nhiều: 1 user có nhiều post
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "image_url")
    private String imageUrl;

    // tự động set khi tạo
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // tự động update khi save
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_published", nullable = false)
    private Boolean isPublished = false;

    // ManyToMany với tags
    @ManyToMany
    @JsonManagedReference
    @JoinTable(
        name = "post_tags",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "tags_id")
    )
    private Set<Tags> tags;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Posts() {
    }

    public Posts(String title, String content, String imageUrl, Boolean isPublished, Set<Tags> tags, Users user) {
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.isPublished = isPublished;
        this.tags = tags;
        this.user = user;
    }
}
