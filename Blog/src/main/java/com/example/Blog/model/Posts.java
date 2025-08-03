package com.example.Blog.model;

import java.time.LocalDateTime;
import java.util.Set;

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

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

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

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = false)
    private String description;

    // ManyToMany với tags
    @ManyToMany
    @JoinTable(name = "post_tags", // bảng join
            joinColumns = @JoinColumn(name = "post_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private Set<Tags> tags;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Posts() {
    }

    public Posts(String content, String description, String imageUrl, Set<Tags> tags, String title, Users user,
            Boolean isPublished) {
        this.content = content;
        this.description = description;
        this.imageUrl = imageUrl;
        this.tags = tags;
        this.title = title;
        this.user = user;
        this.isPublished = isPublished;
    }

}
