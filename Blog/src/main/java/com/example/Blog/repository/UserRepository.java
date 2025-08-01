package com.example.Blog.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.Blog.model.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {
        List<Users> findByNameContaining(String Keyword);

        boolean existsByEmail(String email); // ← Câu lệnh kiểm tra

        List<Users> findByBanned(boolean banned);

        Users findByEmail(String email);

        @Query(value = """
                        SELECT m.name, COALESCE(COUNT(u.id), 0) AS users
                        FROM (
                            SELECT 1 AS month_num, 'Jan' AS name
                            UNION SELECT 2, 'Feb'
                            UNION SELECT 3, 'Mar'
                            UNION SELECT 4, 'Apr'
                            UNION SELECT 5, 'May'
                            UNION SELECT 6, 'Jun'
                            UNION SELECT 7, 'Jul'
                            UNION SELECT 8, 'Aug'
                            UNION SELECT 9, 'Sep'
                            UNION SELECT 10, 'Oct'
                            UNION SELECT 11, 'Nov'
                            UNION SELECT 12, 'Dec'
                        ) m
                        LEFT JOIN users u ON MONTH(u.created_at) = m.month_num
                        GROUP BY m.month_num, m.name
                        ORDER BY m.month_num
                        """, nativeQuery = true)
        List<Map<String, Object>> getUsersByMonth();
}
