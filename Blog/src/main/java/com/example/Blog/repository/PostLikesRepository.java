package com.example.Blog.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.Blog.model.PostLikes;
import com.example.Blog.model.PostLikesId;

@Repository
public interface PostLikesRepository extends JpaRepository<PostLikes, PostLikesId> {
    long countByPostId(Integer postId);

    Optional<PostLikes> findByUserIdAndPostId(Integer userId, Integer postId);

    void deleteByUserIdAndPostId(Integer userId, Integer postId);

    @Query("""
                SELECT p.id, p.content, p.imageUrl, p.createdAt, p.title, p.description,
                       GROUP_CONCAT(t.name), p.user.name
                FROM Posts p
                JOIN PostLikes pl ON p.id = pl.postId
                JOIN p.tags t
                WHERE pl.userId = :userId
                GROUP BY p.id
            """)
    List<Object[]> findByLikePosts(Integer userId);

}