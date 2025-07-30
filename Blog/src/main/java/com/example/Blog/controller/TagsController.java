package com.example.Blog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        return "created tag";
    }

    @GetMapping
    public List<Tags> getAllTags() {
        return tagsRepository.findAll();
    }

    @DeleteMapping("delete/{id}")
    public String deleteTag(@RequestBody Integer id){
        tagsRepository.deleteById(id);
        return "deleted tag";
    }



}
