package com.internship.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateSubmissionRequest {

    @NotBlank(message = "Task is required")
    private String taskId;

    private String repositoryLink;

    private String documentLink;

    @NotBlank(message = "Completion notes are required")
    private String completionNotes;

    public String getTaskId() { return taskId; }
    public void setTaskId(String taskId) { this.taskId = taskId; }

    public String getRepositoryLink() { return repositoryLink; }
    public void setRepositoryLink(String repositoryLink) { this.repositoryLink = repositoryLink; }

    public String getDocumentLink() { return documentLink; }
    public void setDocumentLink(String documentLink) { this.documentLink = documentLink; }

    public String getCompletionNotes() { return completionNotes; }
    public void setCompletionNotes(String completionNotes) { this.completionNotes = completionNotes; }
}
