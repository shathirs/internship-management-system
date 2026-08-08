package com.internship.backend.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    /** JWT principal / User.email */
    @Indexed
    private String recipientEmail;

    private NotificationType type;
    private String title;
    private String message;

    private String relatedTaskId;
    private String relatedSubmissionId;
    private String relatedInternId;

    private boolean read = false;

    private Instant createdAt;

    public Notification() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
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
