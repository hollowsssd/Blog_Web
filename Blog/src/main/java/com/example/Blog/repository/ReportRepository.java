package com.example.Blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Blog.model.UsersReport;

public interface ReportRepository extends JpaRepository<UsersReport, UsersReport.ReportKey > {


    
}
