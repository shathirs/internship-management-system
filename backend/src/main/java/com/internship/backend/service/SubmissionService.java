package com.internship.backend.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.internship.backend.dto.CreateSubmissionRequest;
import com.internship.backend.dto.ReviewSubmissionRequest;
import com.internship.backend.dto.SubmissionResponse;
import com.internship.backend.model.Intern;
import com.internship.backend.model.NotificationType;
import com.internship.backend.model.Submission;
import com.internship.backend.model.SubmissionStatus;
import com.internship.backend.model.Task;
import com.internship.backend.model.TaskStatus;
import com.internship.backend.repository.InternRepository;
import com.internship.backend.repository.SubmissionRepository;
import com.internship.backend.repository.TaskRepository;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final InternRepository internRepository;
    private final TaskRepository taskRepository;
    private final NotificationService notificationService;

    public SubmissionService(
            SubmissionRepository submissionRepository,
            InternRepository internRepository,
            TaskRepository taskRepository,
            NotificationService notificationService
    ) {
        this.submissionRepository = submissionRepository;
        this.internRepository = internRepository;
        this.taskRepository = taskRepository;
        this.notificationService = notificationService;
    }

    public List<SubmissionResponse> getAllForAdmin(String status, String internId) {
        List<Submission> submissions;

        if (status != null && !status.isBlank()) {
            submissions = submissionRepository.findByStatus(
                    SubmissionStatus.valueOf(status.trim().toUpperCase())
            );
        } else if (internId != null && !internId.isBlank()) {
            submissions = submissionRepository.findByInternId(internId.trim());
        } else {
            submissions = submissionRepository.findAll();
        }

        if (internId != null && !internId.isBlank() && status != null && !status.isBlank()) {
            String id = internId.trim();
            submissions = submissions.stream()
                    .filter(s -> id.equals(s.getInternId()))
                    .collect(Collectors.toList());
        }

        return submissions.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<SubmissionResponse> getMySubmissions(String email) {
        Intern intern = requireInternByEmail(email);
        return submissionRepository.findByInternIdOrderByCreatedAtDesc(intern.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public SubmissionResponse getById(String id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));
        return toResponse(submission);
    }

    public SubmissionResponse getByIdForIntern(String id, String email) {
        Intern intern = requireInternByEmail(email);
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));

        if (!intern.getId().equals(submission.getInternId())) {
            throw new IllegalArgumentException("You can only view your own submissions");
        }

        return toResponse(submission);
    }

    public SubmissionResponse create(String email, CreateSubmissionRequest request) {
        Intern intern = requireInternByEmail(email);

        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (task.getAssignedInternId() == null
                || !task.getAssignedInternId().equals(intern.getId())) {
            throw new IllegalArgumentException("You can only submit for tasks assigned to you");
        }

        Instant now = Instant.now();
        Submission submission = new Submission();
        submission.setTaskId(task.getId());
        submission.setInternId(intern.getId());
        submission.setRepositoryLink(request.getRepositoryLink());
        submission.setDocumentLink(request.getDocumentLink());
        submission.setCompletionNotes(request.getCompletionNotes());
        submission.setStatus(SubmissionStatus.SUBMITTED);
        submission.setCreatedAt(now);
        submission.setUpdatedAt(now);

        task.setStatus(TaskStatus.SUBMITTED);
        task.setUpdatedAt(now);
        taskRepository.save(task);

        Submission saved = submissionRepository.save(submission);
        notificationService.notifyAllAdmins(
                NotificationType.WORK_SUBMITTED,
                "New work submission",
                intern.getFullName() + " submitted work for \"" + task.getTitle() + "\".",
                task.getId(),
                saved.getId(),
                intern.getId()
        );
        return toResponse(saved);
    }

    public SubmissionResponse review(String id, ReviewSubmissionRequest request) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));

        if (request.getStatus() == SubmissionStatus.SUBMITTED) {
            throw new IllegalArgumentException(
                    "Review status must be APPROVED, REJECTED, or REVISION_REQUIRED"
            );
        }

        Instant now = Instant.now();
        submission.setStatus(request.getStatus());
        submission.setAdminComment(request.getAdminComment());
        submission.setReviewedAt(now);
        submission.setUpdatedAt(now);

        taskRepository.findById(submission.getTaskId()).ifPresent(task -> {
            if (request.getStatus() == SubmissionStatus.APPROVED) {
                task.setStatus(TaskStatus.COMPLETED);
            } else if (request.getStatus() == SubmissionStatus.REVISION_REQUIRED
                    || request.getStatus() == SubmissionStatus.REJECTED) {
                task.setStatus(TaskStatus.REVISION_REQUIRED);
            }
            task.setUpdatedAt(now);
            taskRepository.save(task);
        });

        Submission saved = submissionRepository.save(submission);
        notifySubmissionReview(saved);
        return toResponse(saved);
    }

    private void notifySubmissionReview(Submission submission) {
        Intern intern = internRepository.findById(submission.getInternId()).orElse(null);
        if (intern == null || intern.getEmail() == null || intern.getEmail().isBlank()) {
            return;
        }

        String taskTitle = taskRepository.findById(submission.getTaskId())
                .map(Task::getTitle)
                .orElse("your task");

        String comment = (submission.getAdminComment() != null
                && !submission.getAdminComment().isBlank())
                ? " Comment: " + submission.getAdminComment()
                : "";

        if (submission.getStatus() == SubmissionStatus.APPROVED) {
            notificationService.create(
                    intern.getEmail(),
                    NotificationType.SUBMISSION_APPROVED,
                    "Submission approved",
                    "Your submission for \"" + taskTitle + "\" was approved." + comment,
                    submission.getTaskId(),
                    submission.getId(),
                    intern.getId()
            );
            return;
        }

        if (submission.getStatus() == SubmissionStatus.REVISION_REQUIRED
                || submission.getStatus() == SubmissionStatus.REJECTED) {
            String title = submission.getStatus() == SubmissionStatus.REJECTED
                    ? "Submission rejected"
                    : "Revision requested";
            String message = submission.getStatus() == SubmissionStatus.REJECTED
                    ? "Your submission for \"" + taskTitle + "\" was rejected." + comment
                    : "Revision requested for \"" + taskTitle + "\"." + comment;

            notificationService.create(
                    intern.getEmail(),
                    NotificationType.REVISION_REQUESTED,
                    title,
                    message,
                    submission.getTaskId(),
                    submission.getId(),
                    intern.getId()
            );
        }
    }

    private Intern requireInternByEmail(String email) {
        return internRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Intern profile not found"));
    }

    private SubmissionResponse toResponse(Submission submission) {
        SubmissionResponse response = new SubmissionResponse();
        response.setId(submission.getId());
        response.setTaskId(submission.getTaskId());
        response.setInternId(submission.getInternId());
        response.setRepositoryLink(submission.getRepositoryLink());
        response.setDocumentLink(submission.getDocumentLink());
        response.setCompletionNotes(submission.getCompletionNotes());
        response.setStatus(submission.getStatus());
        response.setAdminComment(submission.getAdminComment());
        response.setReviewedAt(submission.getReviewedAt());
        response.setCreatedAt(submission.getCreatedAt());
        response.setUpdatedAt(submission.getUpdatedAt());
        return response;
    }
}
