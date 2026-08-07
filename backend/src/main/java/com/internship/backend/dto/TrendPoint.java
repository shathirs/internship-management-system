package com.internship.backend.dto;

public class TrendPoint {

    private String name;
    private long completed;
    private long pending;
    private long overdue;

    public TrendPoint() {
    }

    public TrendPoint(String name, long completed, long pending, long overdue) {
        this.name = name;
        this.completed = completed;
        this.pending = pending;
        this.overdue = overdue;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getCompleted() {
        return completed;
    }

    public void setCompleted(long completed) {
        this.completed = completed;
    }

    public long getPending() {
        return pending;
    }

    public void setPending(long pending) {
        this.pending = pending;
    }

    public long getOverdue() {
        return overdue;
    }

    public void setOverdue(long overdue) {
        this.overdue = overdue;
    }
}
