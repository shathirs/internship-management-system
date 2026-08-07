package com.internship.backend.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.internship.backend.dto.InternPerformanceItem;
import com.internship.backend.dto.ProjectProgressItem;
import com.internship.backend.dto.ReportSummaryResponse;
import com.internship.backend.dto.StatusCount;
import com.internship.backend.dto.TrendPoint;
import com.internship.backend.model.DailyWorkLog;
import com.internship.backend.model.Intern;
import com.internship.backend.model.InternStatus;
import com.internship.backend.model.Project;
import com.internship.backend.model.ProjectStatus;
import com.internship.backend.model.Submission;
import com.internship.backend.model.Task;
import com.internship.backend.model.TaskStatus;
import com.internship.backend.model.WorkLogStatus;
import com.internship.backend.repository.DailyWorkLogRepository;
import com.internship.backend.repository.InternRepository;
import com.internship.backend.repository.ProjectRepository;
import com.internship.backend.repository.SubmissionRepository;
import com.internship.backend.repository.TaskRepository;

@Service
public class ReportService {

    private static final DateTimeFormatter WEEK_LABEL = DateTimeFormatter.ofPattern("MMM d");
    private static final DateTimeFormatter DAY_LABEL = DateTimeFormatter.ofPattern("MMM d");

    private final InternRepository internRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final DailyWorkLogRepository workLogRepository;
    private final SubmissionRepository submissionRepository;

    public ReportService(
            InternRepository internRepository,
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            DailyWorkLogRepository workLogRepository,
            SubmissionRepository submissionRepository
    ) {
        this.internRepository = internRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.workLogRepository = workLogRepository;
        this.submissionRepository = submissionRepository;
    }

    public ReportSummaryResponse getSummary() {
        return getSummary("THIS_MONTH");
    }

    public ReportSummaryResponse getSummary(String range) {
        DateWindow window = resolveWindow(range);

        List<Intern> interns = internRepository.findAll();
        List<Project> projects = projectRepository.findAll();
        List<Task> tasks = taskRepository.findAll();
        List<DailyWorkLog> workLogs = workLogRepository.findAll();
        List<Submission> submissions = submissionRepository.findAll();

        List<Intern> internsInRange = interns.stream()
                .filter(i -> inWindow(i.getCreatedAt(), window))
                .collect(Collectors.toList());
        List<Project> projectsInRange = projects.stream()
                .filter(p -> inWindow(p.getCreatedAt(), window))
                .collect(Collectors.toList());
        List<Task> tasksInRange = tasks.stream()
                .filter(t -> inWindow(t.getCreatedAt(), window))
                .collect(Collectors.toList());
        List<DailyWorkLog> logsInRange = workLogs.stream()
                .filter(l -> inWindow(l.getCreatedAt(), window))
                .collect(Collectors.toList());
        List<Submission> submissionsInRange = submissions.stream()
                .filter(s -> inWindow(s.getCreatedAt(), window))
                .collect(Collectors.toList());

        LocalDate today = LocalDate.now();

        ReportSummaryResponse response = new ReportSummaryResponse();
        response.setRange(window.label);

        // Snapshot (current roster)
        response.setActiveInterns(interns.stream()
                .filter(i -> i.getStatus() == InternStatus.ACTIVE)
                .count());
        response.setActiveProjects(projects.stream()
                .filter(p -> p.getStatus() == ProjectStatus.IN_PROGRESS
                        || p.getStatus() == ProjectStatus.PLANNED)
                .count());

        // Period activity
        response.setTotalInterns(internsInRange.size());
        response.setCompletedTasks(tasksInRange.stream()
                .filter(t -> t.getStatus() == TaskStatus.COMPLETED)
                .count());
        response.setPendingTasks(tasksInRange.stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED)
                .count());
        response.setOverdueTasks(tasksInRange.stream().filter(t -> isOverdue(t, today)).count());
        response.setWorkLogsThisWeek(logsInRange.size());
        response.setTotalSubmissions(submissionsInRange.size());

        response.setInternsByStatus(
                Arrays.stream(InternStatus.values())
                        .map(st -> new StatusCount(
                                st.name(),
                                internsInRange.stream().filter(i -> i.getStatus() == st).count()
                        ))
                        .collect(Collectors.toList())
        );
        response.setTasksByStatus(
                Arrays.stream(TaskStatus.values())
                        .map(st -> new StatusCount(
                                formatStatus(st.name()),
                                tasksInRange.stream().filter(t -> t.getStatus() == st).count()
                        ))
                        .collect(Collectors.toList())
        );
        response.setProjectsByStatus(
                Arrays.stream(ProjectStatus.values())
                        .map(st -> new StatusCount(
                                st.name(),
                                projectsInRange.stream().filter(p -> p.getStatus() == st).count()
                        ))
                        .collect(Collectors.toList())
        );
        response.setWorkLogsByStatus(
                Arrays.stream(WorkLogStatus.values())
                        .map(st -> new StatusCount(
                                st.name(),
                                logsInRange.stream().filter(l -> l.getStatus() == st).count()
                        ))
                        .collect(Collectors.toList())
        );

        response.setTaskProgressTrend(buildTaskProgressTrend(tasksInRange, window, today));
        List<Project> progressProjects = projectsInRange.isEmpty() ? projects : projectsInRange;
        response.setProjectProgress(buildProjectProgress(progressProjects, tasks));
        response.setWorkLogsByWeek(buildWorkLogsByWeek(logsInRange, window, today));
        response.setTopInterns(buildTopInterns(interns, tasksInRange, logsInRange));

        applyPeriodChanges(response, window, interns, projects, tasks, workLogs, submissions);

        return response;
    }

    private void applyPeriodChanges(
            ReportSummaryResponse response,
            DateWindow window,
            List<Intern> interns,
            List<Project> projects,
            List<Task> tasks,
            List<DailyWorkLog> workLogs,
            List<Submission> submissions
    ) {
        DateWindow previous = resolvePreviousWindow(window);
        if (previous == null) {
            return;
        }

        long prevInterns = interns.stream()
                .filter(i -> inWindow(i.getCreatedAt(), previous))
                .count();
        long prevProjects = projects.stream()
                .filter(p -> inWindow(p.getCreatedAt(), previous))
                .count();
        List<Task> prevTasks = tasks.stream()
                .filter(t -> inWindow(t.getCreatedAt(), previous))
                .collect(Collectors.toList());
        long prevCompleted = prevTasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.COMPLETED)
                .count();
        long prevPending = prevTasks.stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED)
                .count();
        long prevLogs = workLogs.stream()
                .filter(l -> inWindow(l.getCreatedAt(), previous))
                .count();
        long prevSubmissions = submissions.stream()
                .filter(s -> inWindow(s.getCreatedAt(), previous))
                .count();

        long currentProjectsCreated = projects.stream()
                .filter(p -> inWindow(p.getCreatedAt(), window))
                .count();

        response.setTotalInternsChange(percentChange(response.getTotalInterns(), prevInterns));
        response.setActiveProjectsChange(percentChange(currentProjectsCreated, prevProjects));
        response.setCompletedTasksChange(percentChange(response.getCompletedTasks(), prevCompleted));
        response.setPendingTasksChange(percentChange(response.getPendingTasks(), prevPending));
        response.setWorkLogsThisWeekChange(percentChange(response.getWorkLogsThisWeek(), prevLogs));
        response.setTotalSubmissionsChange(percentChange(response.getTotalSubmissions(), prevSubmissions));
    }

    private DateWindow resolvePreviousWindow(DateWindow current) {
        if ("ALL".equals(current.label)) {
            return null;
        }

        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);

        if ("LAST_MONTH".equals(current.label)) {
            LocalDate prevStart = monthStart.minusMonths(2);
            LocalDate prevEnd = monthStart.minusMonths(1);
            return new DateWindow(
                    prevStart.atStartOfDay(ZoneOffset.UTC).toInstant(),
                    prevEnd.atStartOfDay(ZoneOffset.UTC).toInstant(),
                    "PREV"
            );
        }

        LocalDate lastStart = monthStart.minusMonths(1);
        return new DateWindow(
                lastStart.atStartOfDay(ZoneOffset.UTC).toInstant(),
                monthStart.atStartOfDay(ZoneOffset.UTC).toInstant(),
                "PREV"
        );
    }

    private Integer percentChange(long current, long previous) {
        if (previous == 0) {
            return current > 0 ? 100 : 0;
        }
        return (int) Math.round(((current - previous) * 100.0) / previous);
    }

    private DateWindow resolveWindow(String range) {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);
        Instant endExclusive = today.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

        if ("LAST_MONTH".equalsIgnoreCase(range)) {
            LocalDate lastStart = monthStart.minusMonths(1);
            return new DateWindow(
                    lastStart.atStartOfDay(ZoneOffset.UTC).toInstant(),
                    monthStart.atStartOfDay(ZoneOffset.UTC).toInstant(),
                    "LAST_MONTH"
            );
        }

        if ("ALL".equalsIgnoreCase(range)) {
            return new DateWindow(Instant.EPOCH, endExclusive, "ALL");
        }

        return new DateWindow(
                monthStart.atStartOfDay(ZoneOffset.UTC).toInstant(),
                endExclusive,
                "THIS_MONTH"
        );
    }

    private List<TrendPoint> buildTaskProgressTrend(
            List<Task> tasks,
            DateWindow window,
            LocalDate today
    ) {
        List<TrendPoint> points = new ArrayList<>();

        for (LocalDate day : dayBuckets(window, today)) {
            Instant start = day.atStartOfDay(ZoneOffset.UTC).toInstant();
            Instant end = day.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

            long completed = tasks.stream()
                    .filter(t -> t.getStatus() == TaskStatus.COMPLETED)
                    .filter(t -> inRange(
                            t.getUpdatedAt() != null ? t.getUpdatedAt() : t.getCreatedAt(),
                            start,
                            end
                    ))
                    .count();

            long pending = tasks.stream()
                    .filter(t -> t.getStatus() != TaskStatus.COMPLETED)
                    .filter(t -> !isOverdue(t, today))
                    .filter(t -> inRange(t.getCreatedAt(), start, end))
                    .count();

            long overdue = tasks.stream()
                    .filter(t -> isOverdue(t, today))
                    .filter(t -> day.equals(parseDate(t.getDeadline())))
                    .count();

            points.add(new TrendPoint(
                    day.format(DAY_LABEL),
                    completed,
                    pending,
                    overdue
            ));
        }

        return points;
    }

    private List<LocalDate> dayBuckets(DateWindow window, LocalDate today) {
        LocalDate start = LocalDate.ofInstant(window.start, ZoneOffset.UTC);
        LocalDate endExclusive = LocalDate.ofInstant(window.end, ZoneOffset.UTC);
        LocalDate last = endExclusive.minusDays(1);
        if (last.isAfter(today)) {
            last = today;
        }

        if ("ALL".equals(window.label)) {
            start = today.minusDays(29);
            last = today;
        }

        List<LocalDate> days = new ArrayList<>();
        for (LocalDate day = start; !day.isAfter(last); day = day.plusDays(1)) {
            days.add(day);
        }
        return days;
    }

    private List<ProjectProgressItem> buildProjectProgress(List<Project> projects, List<Task> tasks) {
        return projects.stream()
                .map(project -> {
                    List<Task> projectTasks = tasks.stream()
                            .filter(t -> Objects.equals(project.getId(), t.getProjectId()))
                            .collect(Collectors.toList());
                    int percent;
                    if (projectTasks.isEmpty()) {
                        percent = project.getStatus() == ProjectStatus.COMPLETED ? 100 : 0;
                    } else {
                        long done = projectTasks.stream()
                                .filter(t -> t.getStatus() == TaskStatus.COMPLETED)
                                .count();
                        percent = (int) Math.round((done * 100.0) / projectTasks.size());
                    }
                    return new ProjectProgressItem(project.getId(), project.getName(), percent);
                })
                .sorted(Comparator.comparingInt(ProjectProgressItem::getProgressPercent).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }

    private List<StatusCount> buildWorkLogsByWeek(
            List<DailyWorkLog> workLogs,
            DateWindow window,
            LocalDate today
    ) {
        List<StatusCount> weeks = new ArrayList<>();
        for (LocalDate[] bucket : weekBuckets(window, today)) {
            LocalDate weekStart = bucket[0];
            LocalDate weekEnd = bucket[1];
            Instant start = weekStart.atStartOfDay(ZoneOffset.UTC).toInstant();
            Instant end = weekEnd.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

            long count = workLogs.stream()
                    .filter(log -> {
                        LocalDate logDate = parseDate(log.getLogDate());
                        if (logDate != null) {
                            return !logDate.isBefore(weekStart) && !logDate.isAfter(weekEnd);
                        }
                        return inRange(log.getCreatedAt(), start, end);
                    })
                    .count();

            weeks.add(new StatusCount(weekStart.format(WEEK_LABEL), count));
        }
        return weeks;
    }

    private List<LocalDate[]> weekBuckets(DateWindow window, LocalDate today) {
        List<LocalDate[]> buckets = new ArrayList<>();
        LocalDate windowStart = LocalDate.ofInstant(window.start, ZoneOffset.UTC);
        LocalDate windowEndExclusive = LocalDate.ofInstant(window.end, ZoneOffset.UTC);
        LocalDate lastDay = windowEndExclusive.minusDays(1);
        if (lastDay.isAfter(today)) {
            lastDay = today;
        }

        if ("ALL".equals(window.label) || windowStart.isBefore(today.minusWeeks(8))) {
            for (int i = 4; i >= 0; i--) {
                LocalDate weekEnd = today.minusWeeks(i);
                LocalDate weekStart = weekEnd.minusDays(6);
                buckets.add(new LocalDate[]{weekStart, weekEnd});
            }
            return buckets;
        }

        LocalDate cursor = windowStart;
        while (!cursor.isAfter(lastDay) && buckets.size() < 6) {
            LocalDate weekEnd = cursor.plusDays(6);
            if (weekEnd.isAfter(lastDay)) {
                weekEnd = lastDay;
            }
            buckets.add(new LocalDate[]{cursor, weekEnd});
            cursor = weekEnd.plusDays(1);
        }

        if (buckets.isEmpty()) {
            buckets.add(new LocalDate[]{today, today});
        }
        return buckets;
    }

    private List<InternPerformanceItem> buildTopInterns(
            List<Intern> interns,
            List<Task> tasks,
            List<DailyWorkLog> workLogs
    ) {
        return interns.stream()
                .map(intern -> {
                    List<Task> assigned = tasks.stream()
                            .filter(t -> Objects.equals(intern.getId(), t.getAssignedInternId()))
                            .collect(Collectors.toList());
                    long completed = assigned.stream()
                            .filter(t -> t.getStatus() == TaskStatus.COMPLETED)
                            .count();
                    long logs = workLogs.stream()
                            .filter(l -> Objects.equals(intern.getId(), l.getInternId()))
                            .count();

                    int taskScore = assigned.isEmpty()
                            ? 0
                            : (int) Math.round((completed * 100.0) / assigned.size());
                    int logBonus = (int) Math.min(20, logs * 2);
                    int score = Math.min(100, taskScore + logBonus);

                    return new InternPerformanceItem(intern.getId(), intern.getFullName(), score);
                })
                .sorted(Comparator.comparingInt(InternPerformanceItem::getScore).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }

    private boolean isOverdue(Task task, LocalDate today) {
        if (task.getStatus() == TaskStatus.COMPLETED) {
            return false;
        }
        LocalDate deadline = parseDate(task.getDeadline());
        return deadline != null && deadline.isBefore(today);
    }

    private boolean inWindow(Instant instant, DateWindow window) {
        return instant != null
                && !instant.isBefore(window.start)
                && instant.isBefore(window.end);
    }

    private boolean inRange(Instant instant, Instant start, Instant end) {
        return instant != null && !instant.isBefore(start) && instant.isBefore(end);
    }

    private LocalDate parseDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(value);
        } catch (Exception ex) {
            return null;
        }
    }

    private String formatStatus(String status) {
        return Arrays.stream(status.split("_"))
                .map(part -> part.charAt(0) + part.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }

    private static class DateWindow {
        final Instant start;
        final Instant end;
        final String label;

        DateWindow(Instant start, Instant end, String label) {
            this.start = start;
            this.end = end;
            this.label = label;
        }
    }
}
