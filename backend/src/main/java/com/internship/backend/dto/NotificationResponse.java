package com.internship.backend.dto;

import java.time.Instant;

import com.internship.backend.model.NotificationType;

public class NotificationResponse {

    private String id;
    private NotificationType type;
    private String title;
    private String message;
    private String relatedTaskId;
    private String relatedSubmissionId;
    private String relatedInternId;
    private boolean read;
    private Instant createdAt;

    public NotificationResponse() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRelatedTaskId() {
        return relatedTaskId;
    }

    public void setRelatedTaskId(String relatedTaskId) {
        this.relatedTaskId = relatedTaskId;
    }

    public String getRelatedSubmissionId() {
        return relatedSubmissionId;
    }

    public void setRelatedSubmissionId(String relatedSubmissionId) {
        this.relatedSubmissionId = relatedSubmissionId;
    }

    public String getRelatedInternId() {
        return relatedInternId;
    }

    public void setRelatedInternId(String relatedInternId) {
        this.relatedInternId = relatedInternId;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
