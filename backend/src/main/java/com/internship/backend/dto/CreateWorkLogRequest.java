package com.internship.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateWorkLogRequest {

    @NotBlank(message = "Log date is required")
    private String logDate;

    @NotBlank(message = "Completed work is required")
    private String completedWork;

    @NotBlank(message = "Current work is required")
    private String currentWork;

    private String challenges;

    @NotNull(message = "Hours worked is required")
    @DecimalMin(value = "0.5", message = "Hours worked must be at least 0.5")
    private Double hoursWorked;

    @NotBlank(message = "Tomorrow plan is required")
    private String tomorrowPlan;

    public String getLogDate() { return logDate; }
    public void setLogDate(String logDate) { this.logDate = logDate; }

    public String getCompletedWork() { return completedWork; }
    public void setCompletedWork(String completedWork) { this.completedWork = completedWork; }

    public String getCurrentWork() { return currentWork; }
    public void setCurrentWork(String currentWork) { this.currentWork = currentWork; }

    public String getChallenges() { return challenges; }
    public void setChallenges(String challenges) { this.challenges = challenges; }

    public Double getHoursWorked() { return hoursWorked; }
    public void setHoursWorked(Double hoursWorked) { this.hoursWorked = hoursWorked; }

    public String getTomorrowPlan() { return tomorrowPlan; }
    public void setTomorrowPlan(String tomorrowPlan) { this.tomorrowPlan = tomorrowPlan; }
}
