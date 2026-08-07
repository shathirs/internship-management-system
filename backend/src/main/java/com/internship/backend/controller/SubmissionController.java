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

import com.internship.backend.dto.CreateSubmissionRequest;
import com.internship.backend.dto.ReviewSubmissionRequest;
import com.internship.backend.dto.SubmissionResponse;
import com.internship.backend.service.SubmissionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SubmissionResponse>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String internId
    ) {
        return ResponseEntity.ok(submissionService.getAllForAdmin(status, internId));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('INTERN')")
    public ResponseEntity<List<SubmissionResponse>> getMySubmissions(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                submissionService.getMySubmissions(authentication.getName())
        );
    }

    @GetMapping("/me/{id}")
    @PreAuthorize("hasRole('INTERN')")
    public ResponseEntity<SubmissionResponse> getMyById(
            @PathVariable String id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                submissionService.getByIdForIntern(id, authentication.getName())
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubmissionResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(submissionService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('INTERN')")
    public ResponseEntity<SubmissionResponse> create(
            @Valid @RequestBody CreateSubmissionRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(submissionService.create(authentication.getName(), request));
    }

    @PatchMapping("/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubmissionResponse> review(
            @PathVariable String id,
            @Valid @RequestBody ReviewSubmissionRequest request
    ) {
        return ResponseEntity.ok(submissionService.review(id, request));
    }
}
