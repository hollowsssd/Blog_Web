package com.example.Blog.service;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Blog.model.Tags;
import com.example.Blog.repository.TagsRepository;

@Service
public class TagService {


     @Autowired
    private TagsRepository tagRepository;

    public List<Tags> getTagsByIds(Set<Integer> ids) {
        return tagRepository.findAllById(ids);
    }
}
