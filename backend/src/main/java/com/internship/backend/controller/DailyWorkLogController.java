package com.internship.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.internship.backend.dto.CreateWorkLogRequest;
import com.internship.backend.dto.ReviewWorkLogRequest;
import com.internship.backend.dto.WorkLogResponse;
import com.internship.backend.service.DailyWorkLogService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/work-logs")
public class DailyWorkLogController {

    private final DailyWorkLogService workLogService;

    public DailyWorkLogController(DailyWorkLogService workLogService) {
        this.workLogService = workLogService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<WorkLogResponse>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String internId
    ) {
        return ResponseEntity.ok(workLogService.getAllForAdmin(status, internId));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('INTERN')")
    public ResponseEntity<List<WorkLogResponse>> getMyLogs(Authentication authentication) {
        return ResponseEntity.ok(workLogService.getMyLogs(authentication.getName()));
    }

    @GetMapping("/me/{id}")
    @PreAuthorize("hasRole('INTERN')")
    public ResponseEntity<WorkLogResponse> getMyById(
            @PathVariable String id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                workLogService.getByIdForIntern(id, authentication.getName())
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WorkLogResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(workLogService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('INTERN')")
    public ResponseEntity<WorkLogResponse> create(
            @Valid @RequestBody CreateWorkLogRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(workLogService.create(authentication.getName(), request));
    }

    @PatchMapping("/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WorkLogResponse> review(
            @PathVariable String id,
            @Valid @RequestBody ReviewWorkLogRequest request
    ) {
        return ResponseEntity.ok(workLogService.review(id, request));
    }
}
