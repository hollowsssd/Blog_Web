package com.example.Blog.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.Blog.model.Posts;
import com.example.Blog.repository.TagsRepository;
import com.example.Blog.service.JwtService;
import com.example.Blog.service.PostService;
import com.example.Blog.service.TagService;
import com.example.Blog.service.UsersService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(PostController.class)
@AutoConfigureMockMvc(addFilters = false)
class PostTagSearchTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    @MockBean PostService postService;
    @MockBean UsersService usersService;      // cần mock vì có @Autowired trong controller
    @MockBean TagsRepository tagsRepository;  // dùng thật trong 2 test này
    @MockBean JwtService jwtService;          // để khỏi lỗi context
    @MockBean TagService tagService;

    // TC1: Tag tồn tại -> 200 OK + trả list post
    @Test
    void getPostsByTag_tagExists_returnPosts200() throws Exception {
        Integer tagId = 123;

        Posts p1 = new Posts();
        p1.setId(1);
        Posts p2 = new Posts();
        p2.setId(2);

        Mockito.when(tagsRepository.existsById(tagId)).thenReturn(true);
        Mockito.when(postService.getPostsByTagId(tagId)).thenReturn(List.of(p1, p2));

        mockMvc.perform(get("/post/tag/{tagId}", tagId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andDo(print());
    }

    // TC2: Tag không tồn tại -> 404 + "Tag không tồn tại!"
    @Test
    void getPostsByTag_tagNotExists_404() throws Exception {
        Integer tagId = 1234;

        Mockito.when(tagsRepository.existsById(tagId)).thenReturn(false);

        mockMvc.perform(get("/post/tag/{tagId}", tagId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Tag không tồn tại!"));
    }
}
