package com.example.Blog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Blog.model.UsersReport;
import com.example.Blog.repository.ReportRepository;
import com.example.Blog.service.UsersService;

@RestController
@RequestMapping("/report")
public class ReportController {
    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UsersService usersService;

    @GetMapping
    public ResponseEntity<List<UsersReport>> getAllReport() {
        List<UsersReport> reports = reportRepository.findAll();
        return ResponseEntity.ok(reports);
    }

    @PostMapping("/add")
    public ResponseEntity<String> themReport(
            @RequestParam("reported_Id") Integer reportedId,
            @RequestParam("reporter_Id") Integer reporterId,
            @RequestParam("reason") String reason) {

        try {
            if (reportedId.equals(reporterId)) {
                throw new RuntimeException("Cannot report yourself");
            }

            usersService.getUserById(reportedId);

            usersService.getUserById(reporterId);

            UsersReport usersReport = new UsersReport(reason, reportedId, reporterId);

            reportRepository.save(usersReport);
            return ResponseEntity.ok("added report");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> xoaReport(
            @RequestParam("reported_Id") Integer reportedId,
            @RequestParam("reporter_Id") Integer reporterId) {

        UsersReport.ReportKey key = new UsersReport.ReportKey(reportedId, reporterId);

        if (!reportRepository.existsById(key)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Report not found");
        }

        reportRepository.deleteById(key);
        return ResponseEntity.ok("deleted report");
    }

}
