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
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "posts")
public class Posts {
    @Getter@Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    private String content;
    @Column(name = "image_url")
    private String imageUrl;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @Column(name = "is_published")
    private Boolean isPublished;
    

    @ManyToMany
    @JoinTable(
            name = "post_tags",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tags> tags;


    public Posts(){}

    public Posts(String content, LocalDateTime createdAt, String imageUrl, Boolean isPublished, Set<Tags> tags, LocalDateTime updatedAt, Users user) {
        this.content = content;
        this.createdAt = createdAt;
        this.imageUrl = imageUrl;
        this.isPublished = isPublished;
        this.tags = tags;
        this.updatedAt = updatedAt;
        this.user = user;
    }

}
