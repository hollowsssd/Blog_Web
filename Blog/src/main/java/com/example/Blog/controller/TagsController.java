package com.example.Blog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.Blog.model.Tags;
import com.example.Blog.repository.TagsRepository;

@RestController
@RequestMapping("/api/tags")
public class TagsController {

    @Autowired
    private TagsRepository tagsRepository;


    @PostMapping("/add")
    public String createTag(@RequestBody Tags tag) {
        tagsRepository.save(tag);
        return "Created tag successfully";
    }

    // Lấy tất cả tag
    @GetMapping
    public List<Tags> getAllTags() {
        return tagsRepository.findAll();
    }

    // Xóa tag theo id
    @DeleteMapping("/delete/{id}")
    public String deleteTag(@PathVariable Integer id) {
        tagsRepository.deleteById(id);
        return "deleted tag";
    }
}
