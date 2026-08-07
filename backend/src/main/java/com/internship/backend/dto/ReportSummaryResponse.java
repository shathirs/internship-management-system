package com.internship.backend.dto;

import java.util.List;

public class ReportSummaryResponse {

    private String range;

    private long totalInterns;
    private long activeInterns;
    private long activeProjects;
    private long pendingTasks;
    private long completedTasks;
    private long overdueTasks;
    private long workLogsThisWeek;
    private long totalSubmissions;

    private Integer totalInternsChange;
    private Integer activeProjectsChange;
    private Integer completedTasksChange;
    private Integer pendingTasksChange;
    private Integer workLogsThisWeekChange;
    private Integer totalSubmissionsChange;

    private List<StatusCount> internsByStatus;
    private List<StatusCount> tasksByStatus;
    private List<StatusCount> projectsByStatus;
    private List<StatusCount> workLogsByStatus;

    private List<TrendPoint> taskProgressTrend;
    private List<ProjectProgressItem> projectProgress;
    private List<StatusCount> workLogsByWeek;
    private List<InternPerformanceItem> topInterns;

    public ReportSummaryResponse() {
    }

    public String getRange() {
        return range;
    }

    public void setRange(String range) {
        this.range = range;
    }

    public long getTotalInterns() {
        return totalInterns;
    }

    public void setTotalInterns(long totalInterns) {
        this.totalInterns = totalInterns;
    }

    public long getActiveInterns() {
        return activeInterns;
    }

    public void setActiveInterns(long activeInterns) {
        this.activeInterns = activeInterns;
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

    public long getWorkLogsThisWeek() {
        return workLogsThisWeek;
    }

    public void setWorkLogsThisWeek(long workLogsThisWeek) {
        this.workLogsThisWeek = workLogsThisWeek;
    }

    public long getTotalSubmissions() {
        return totalSubmissions;
    }

    public void setTotalSubmissions(long totalSubmissions) {
        this.totalSubmissions = totalSubmissions;
    }

    public Integer getTotalInternsChange() {
        return totalInternsChange;
    }

    public void setTotalInternsChange(Integer totalInternsChange) {
        this.totalInternsChange = totalInternsChange;
    }

    public Integer getActiveProjectsChange() {
        return activeProjectsChange;
    }

    public void setActiveProjectsChange(Integer activeProjectsChange) {
        this.activeProjectsChange = activeProjectsChange;
    }

    public Integer getCompletedTasksChange() {
        return completedTasksChange;
    }

    public void setCompletedTasksChange(Integer completedTasksChange) {
        this.completedTasksChange = completedTasksChange;
    }

    public Integer getPendingTasksChange() {
        return pendingTasksChange;
    }

    public void setPendingTasksChange(Integer pendingTasksChange) {
        this.pendingTasksChange = pendingTasksChange;
    }

    public Integer getWorkLogsThisWeekChange() {
        return workLogsThisWeekChange;
    }

    public void setWorkLogsThisWeekChange(Integer workLogsThisWeekChange) {
        this.workLogsThisWeekChange = workLogsThisWeekChange;
    }

    public Integer getTotalSubmissionsChange() {
        return totalSubmissionsChange;
    }

    public void setTotalSubmissionsChange(Integer totalSubmissionsChange) {
        this.totalSubmissionsChange = totalSubmissionsChange;
    }

    public List<StatusCount> getInternsByStatus() {
        return internsByStatus;
    }

    public void setInternsByStatus(List<StatusCount> internsByStatus) {
        this.internsByStatus = internsByStatus;
    }

    public List<StatusCount> getTasksByStatus() {
        return tasksByStatus;
    }

    public void setTasksByStatus(List<StatusCount> tasksByStatus) {
        this.tasksByStatus = tasksByStatus;
    }

    public List<StatusCount> getProjectsByStatus() {
        return projectsByStatus;
    }

    public void setProjectsByStatus(List<StatusCount> projectsByStatus) {
        this.projectsByStatus = projectsByStatus;
    }

    public List<StatusCount> getWorkLogsByStatus() {
        return workLogsByStatus;
    }

    public void setWorkLogsByStatus(List<StatusCount> workLogsByStatus) {
        this.workLogsByStatus = workLogsByStatus;
    }

    public List<TrendPoint> getTaskProgressTrend() {
        return taskProgressTrend;
    }

    public void setTaskProgressTrend(List<TrendPoint> taskProgressTrend) {
        this.taskProgressTrend = taskProgressTrend;
    }

    public List<ProjectProgressItem> getProjectProgress() {
        return projectProgress;
    }

    public void setProjectProgress(List<ProjectProgressItem> projectProgress) {
        this.projectProgress = projectProgress;
    }

    public List<StatusCount> getWorkLogsByWeek() {
        return workLogsByWeek;
    }

    public void setWorkLogsByWeek(List<StatusCount> workLogsByWeek) {
        this.workLogsByWeek = workLogsByWeek;
    }

    public List<InternPerformanceItem> getTopInterns() {
        return topInterns;
    }

    public void setTopInterns(List<InternPerformanceItem> topInterns) {
        this.topInterns = topInterns;
    }
}
