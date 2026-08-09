package com.internship.backend.dto;

import java.util.List;

public class InternDashboardSummaryResponse {

    private long myTasks;
    private long inProgressTasks;
    private long completedTasks;
    private long overdueTasks;
    private long myWorkLogs;
    private long pendingSubmissions;

    private List<DashboardActivityItem> recentNotifications;
    private List<DashboardDeadlineItem> upcomingDeadlines;

    public InternDashboardSummaryResponse() {
    }

    public long getMyTasks() {
        return myTasks;
    }

    public void setMyTasks(long myTasks) {
        this.myTasks = myTasks;
    }

    public long getInProgressTasks() {
        return inProgressTasks;
    }

    public void setInProgressTasks(long inProgressTasks) {
        this.inProgressTasks = inProgressTasks;
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

    public long getMyWorkLogs() {
        return myWorkLogs;
    }

    public void setMyWorkLogs(long myWorkLogs) {
        this.myWorkLogs = myWorkLogs;
    }

    public long getPendingSubmissions() {
        return pendingSubmissions;
    }

    public void setPendingSubmissions(long pendingSubmissions) {
        this.pendingSubmissions = pendingSubmissions;
    }

    public List<DashboardActivityItem> getRecentNotifications() {
        return recentNotifications;
    }

    public void setRecentNotifications(List<DashboardActivityItem> recentNotifications) {
        this.recentNotifications = recentNotifications;
    }

    public List<DashboardDeadlineItem> getUpcomingDeadlines() {
        return upcomingDeadlines;
    }

    public void setUpcomingDeadlines(List<DashboardDeadlineItem> upcomingDeadlines) {
        this.upcomingDeadlines = upcomingDeadlines;
    }
}
