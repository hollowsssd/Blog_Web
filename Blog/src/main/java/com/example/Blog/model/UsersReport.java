package com.example.Blog.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="users_report")
public class UsersReport {

    @Getter@Setter
    @Id
    private Integer reported_id;
    @Id
    private Integer reporter_id;
    
    private String reason;
    @Column(name="created_at")
    private LocalDateTime createAt;

    public UsersReport(LocalDateTime createAt, String reason, Integer reported_id, Integer reporter_id) {
        this.createAt = createAt;
        this.reason = reason;
        this.reported_id = reported_id;
        this.reporter_id = reporter_id;
    }
     public UsersReport(){}

    


}
