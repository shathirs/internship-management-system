package com.internship.backend.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.internship.backend.dto.CreateWorkLogRequest;
import com.internship.backend.dto.ReviewWorkLogRequest;
import com.internship.backend.dto.WorkLogResponse;
import com.internship.backend.model.DailyWorkLog;
import com.internship.backend.model.Intern;
import com.internship.backend.model.WorkLogStatus;
import com.internship.backend.repository.DailyWorkLogRepository;
import com.internship.backend.repository.InternRepository;

@Service
public class DailyWorkLogService {

    private final DailyWorkLogRepository workLogRepository;
    private final InternRepository internRepository;

    public DailyWorkLogService(
            DailyWorkLogRepository workLogRepository,
            InternRepository internRepository
    ) {
        this.workLogRepository = workLogRepository;
        this.internRepository = internRepository;
    }

    public List<WorkLogResponse> getAllForAdmin(String status, String internId) {
        List<DailyWorkLog> logs;

        if (status != null && !status.isBlank()) {
            logs = workLogRepository.findByStatus(
                    WorkLogStatus.valueOf(status.trim().toUpperCase())
            );
        } else if (internId != null && !internId.isBlank()) {
            logs = workLogRepository.findByInternId(internId.trim());
        } else {
            logs = workLogRepository.findAll();
        }

        if (internId != null && !internId.isBlank() && status != null && !status.isBlank()) {
            String id = internId.trim();
            logs = logs.stream()
                    .filter(log -> id.equals(log.getInternId()))
                    .collect(Collectors.toList());
        }

        return logs.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<WorkLogResponse> getMyLogs(String email) {
        Intern intern = requireInternByEmail(email);
        return workLogRepository.findByInternIdOrderByLogDateDesc(intern.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public WorkLogResponse getById(String id) {
        DailyWorkLog log = workLogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Work log not found"));
        return toResponse(log);
    }

    public WorkLogResponse getByIdForIntern(String id, String email) {
        Intern intern = requireInternByEmail(email);
        DailyWorkLog log = workLogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Work log not found"));

        if (!intern.getId().equals(log.getInternId())) {
            throw new IllegalArgumentException("You can only view your own work logs");
        }

        return toResponse(log);
    }

    public WorkLogResponse create(String email, CreateWorkLogRequest request) {
        Intern intern = requireInternByEmail(email);

        workLogRepository.findByInternIdAndLogDate(intern.getId(), request.getLogDate())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("A work log already exists for this date");
                });

        Instant now = Instant.now();
        DailyWorkLog log = new DailyWorkLog();
        log.setInternId(intern.getId());
        log.setLogDate(request.getLogDate());
        log.setCompletedWork(request.getCompletedWork());
        log.setCurrentWork(request.getCurrentWork());
        log.setChallenges(request.getChallenges());
        log.setHoursWorked(request.getHoursWorked());
        log.setTomorrowPlan(request.getTomorrowPlan());
        log.setStatus(WorkLogStatus.SUBMITTED);
        log.setCreatedAt(now);
        log.setUpdatedAt(now);

        return toResponse(workLogRepository.save(log));
    }

    public WorkLogResponse review(String id, ReviewWorkLogRequest request) {
        DailyWorkLog log = workLogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Work log not found"));

        if (request.getStatus() == WorkLogStatus.SUBMITTED) {
            throw new IllegalArgumentException("Review status must be REVIEWED or NEEDS_REVISION");
        }

        Instant now = Instant.now();
        log.setStatus(request.getStatus());
        log.setAdminComment(request.getAdminComment());
        log.setReviewedAt(now);
        log.setUpdatedAt(now);

        return toResponse(workLogRepository.save(log));
    }

    private Intern requireInternByEmail(String email) {
        return internRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Intern profile not found"));
    }

    private WorkLogResponse toResponse(DailyWorkLog log) {
        WorkLogResponse response = new WorkLogResponse();
        response.setId(log.getId());
        response.setInternId(log.getInternId());
        response.setLogDate(log.getLogDate());
        response.setCompletedWork(log.getCompletedWork());
        response.setCurrentWork(log.getCurrentWork());
        response.setChallenges(log.getChallenges());
        response.setHoursWorked(log.getHoursWorked());
        response.setTomorrowPlan(log.getTomorrowPlan());
        response.setStatus(log.getStatus());
        response.setAdminComment(log.getAdminComment());
        response.setReviewedAt(log.getReviewedAt());
        response.setCreatedAt(log.getCreatedAt());
        response.setUpdatedAt(log.getUpdatedAt());
        return response;
    }
}
