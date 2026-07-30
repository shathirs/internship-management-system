package com.internship.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.internship.backend.dto.CreateInternRequest;
import com.internship.backend.dto.InternResponse;
import com.internship.backend.dto.UpdateInternRequest;
import com.internship.backend.service.InternService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/interns")
@PreAuthorize("hasRole('ADMIN')")
public class InternController {

    private final InternService internService;

    public InternController(InternService internService) {
        this.internService = internService;
    }

    @GetMapping
    public ResponseEntity<List<InternResponse>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String department
    ) {
        return ResponseEntity.ok(internService.getAll(search, status, department));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InternResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(internService.getById(id));
    }

    @PostMapping
    public ResponseEntity<InternResponse> create(@Valid @RequestBody CreateInternRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(internService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InternResponse> update(
            @PathVariable String id,
            @Valid @RequestBody UpdateInternRequest request
    ) {
        return ResponseEntity.ok(internService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        internService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<InternResponse> activate(@PathVariable String id) {
        return ResponseEntity.ok(internService.activate(id));
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<InternResponse> deactivate(@PathVariable String id) {
        return ResponseEntity.ok(internService.deactivate(id));
    }
}