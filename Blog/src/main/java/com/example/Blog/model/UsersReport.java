package com.example.Blog.model;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users_report")
@IdClass(UsersReport.ReportKey.class) // dùng composite key
public class UsersReport {

    @Id
    @Column(name = "reported_id", nullable = false)
    private Integer reportedId;

    @Id
    @Column(name = "reporter_id", nullable = false)
    private Integer reporterId;

    @Column(nullable = false)
    private String reason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Tự động set createdAt khi insert
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public UsersReport() {}

    public UsersReport(String reason, Integer reportedId, Integer reporterId) {
        this.reason = reason;
        this.reportedId = reportedId;
        this.reporterId = reporterId;
    }

    // Lớp composite key
    public static class ReportKey implements Serializable {
        private Integer reportedId;
        private Integer reporterId;

        public ReportKey() {}

        public ReportKey(Integer reportedId, Integer reporterId) {
            this.reportedId = reportedId;
            this.reporterId = reporterId;
        }

        // equals & hashCode để Hibernate nhận dạng cặp khóa chính
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof ReportKey)) return false;
            ReportKey that = (ReportKey) o;
            return reportedId.equals(that.reportedId) &&
                   reporterId.equals(that.reporterId);
        }

        @Override
        public int hashCode() {
            return reportedId.hashCode() + reporterId.hashCode();
        }
    }
}
