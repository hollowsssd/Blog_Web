package com.example.Blog.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.Blog.model.Posts;
@Repository
public interface PostRepository extends JpaRepository<Posts, Integer> {

    
    List<Posts> findByUserId(Integer userId);

    List<Posts> findByTags_Id(Integer tagId);

    // List<Posts> findBy(Integer tagId);

    List<Posts> findAllByOrderByCreatedAtDesc();

    @Query(value = """
    SELECT p.* FROM posts p
    LEFT JOIN (
        SELECT post_id, COUNT(*) AS like_count
        FROM post_likes
        GROUP BY post_id
    ) l ON p.id = l.post_id
    ORDER BY COALESCE(l.like_count, 0) DESC
""", nativeQuery = true)
    List<Posts> findAllWithLikeCountSorted();



}
