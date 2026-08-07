package com.internship.backend.dto;

import java.time.Instant;

import com.internship.backend.model.SubmissionStatus;

public class SubmissionResponse {

    private String id;
    private String taskId;
    private String internId;
    private String repositoryLink;
    private String documentLink;
    private String completionNotes;
    private SubmissionStatus status;
    private String adminComment;
    private Instant reviewedAt;
    private Instant createdAt;
    private Instant updatedAt;

    public SubmissionResponse() {
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTaskId() { return taskId; }
    public void setTaskId(String taskId) { this.taskId = taskId; }

    public String getInternId() { return internId; }
    public void setInternId(String internId) { this.internId = internId; }

    public String getRepositoryLink() { return repositoryLink; }
    public void setRepositoryLink(String repositoryLink) { this.repositoryLink = repositoryLink; }

    public String getDocumentLink() { return documentLink; }
    public void setDocumentLink(String documentLink) { this.documentLink = documentLink; }

    public String getCompletionNotes() { return completionNotes; }
    public void setCompletionNotes(String completionNotes) { this.completionNotes = completionNotes; }

    public SubmissionStatus getStatus() { return status; }
    public void setStatus(SubmissionStatus status) { this.status = status; }

    public String getAdminComment() { return adminComment; }
    public void setAdminComment(String adminComment) { this.adminComment = adminComment; }

    public Instant getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(Instant reviewedAt) { this.reviewedAt = reviewedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
