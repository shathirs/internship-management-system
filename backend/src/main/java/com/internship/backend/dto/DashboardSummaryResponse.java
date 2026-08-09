package com.internship.backend.dto;

import java.util.List;

public class DashboardSummaryResponse {

    private long totalInterns;
    private long activeProjects;
    private long pendingTasks;
    private long completedTasks;
    private long overdueTasks;
    private long todaysWorkLogs;

    private List<DashboardActivityItem> recentActivities;
    private List<DashboardDeadlineItem> upcomingDeadlines;

    public DashboardSummaryResponse() {
    }

    public long getTotalInterns() {
        return totalInterns;
    }

    public void setTotalInterns(long totalInterns) {
        this.totalInterns = totalInterns;
    }

    public long getActiveProjects() {
        return activeProjects;
    }

    public void setActiveProjects(long activeProjects) {
        this.activeProjects = activeProjects;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getOverdueTasks() {
        return overdueTasks;
    }

    public void setOverdueTasks(long overdueTasks) {
        this.overdueTasks = overdueTasks;
    }

    public long getTodaysWorkLogs() {
        return todaysWorkLogs;
    }

    public void setTodaysWorkLogs(long todaysWorkLogs) {
        this.todaysWorkLogs = todaysWorkLogs;
    }

    public List<DashboardActivityItem> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<DashboardActivityItem> recentActivities) {
        this.recentActivities = recentActivities;
    }

    public List<DashboardDeadlineItem> getUpcomingDeadlines() {
        return upcomingDeadlines;
    }

    public void setUpcomingDeadlines(List<DashboardDeadlineItem> upcomingDeadlines) {
        this.upcomingDeadlines = upcomingDeadlines;
    }
}
