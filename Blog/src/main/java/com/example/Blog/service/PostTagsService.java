package com.example.Blog.service;

import java.util.List;
import java.util.Optional;

import com.example.Blog.model.PostTagsId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Blog.model.PostTags;
import com.example.Blog.repository.PostTagsRepository;

@Service
public class PostTagsService {

    @Autowired

    private PostTagsRepository postTagsRepository;

    public List<PostTags> getAllPostTags() {
        return postTagsRepository.findAll();
    }

    public Optional<PostTags> getPostTagsById(int postId, int tagsId) {
        PostTagsId id = new PostTagsId(postId, tagsId);
        return postTagsRepository.findById(id);
    }

    public PostTags savePostTags(PostTags posttags) {
        return postTagsRepository.save(posttags);
    }

    public void deletePostTags(int postId, int tagsId) {
        PostTagsId id = new PostTagsId(postId, tagsId);
        postTagsRepository.deleteById(id);
    }

}

