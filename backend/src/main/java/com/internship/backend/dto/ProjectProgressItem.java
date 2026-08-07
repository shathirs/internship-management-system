package com.internship.backend.dto;

public class ProjectProgressItem {

    private String projectId;
    private String name;
    private int progressPercent;

    public ProjectProgressItem() {
    }

    public ProjectProgressItem(String projectId, String name, int progressPercent) {
        this.projectId = projectId;
        this.name = name;
        this.progressPercent = progressPercent;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getProgressPercent() {
        return progressPercent;
    }

    public void setProgressPercent(int progressPercent) {
        this.progressPercent = progressPercent;
    }
}
