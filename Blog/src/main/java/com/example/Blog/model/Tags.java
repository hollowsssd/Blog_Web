package com.example.Blog.model;

import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="tags")
public class Tags {

    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;

    public Tags(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
    public Tags(){}

    
    @ManyToMany(mappedBy = "tags")
    private Set<Posts> posts;

}
