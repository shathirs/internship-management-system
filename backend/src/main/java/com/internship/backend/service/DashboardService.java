package com.internship.backend.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.internship.backend.dto.DashboardActivityItem;
import com.internship.backend.dto.DashboardDeadlineItem;
import com.internship.backend.dto.DashboardSummaryResponse;
import com.internship.backend.model.DailyWorkLog;
import com.internship.backend.model.Intern;
import com.internship.backend.model.Notification;
import com.internship.backend.model.NotificationType;
import com.internship.backend.model.Project;
import com.internship.backend.model.ProjectStatus;
import com.internship.backend.model.Task;
import com.internship.backend.model.TaskStatus;
import com.internship.backend.repository.DailyWorkLogRepository;
import com.internship.backend.repository.InternRepository;
import com.internship.backend.repository.NotificationRepository;
import com.internship.backend.repository.ProjectRepository;
import com.internship.backend.repository.TaskRepository;

@Service
public class DashboardService {

    private final InternRepository internRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final DailyWorkLogRepository workLogRepository;
    private final NotificationRepository notificationRepository;

    public DashboardService(
            InternRepository internRepository,
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            DailyWorkLogRepository workLogRepository,
            NotificationRepository notificationRepository
    ) {
        this.internRepository = internRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.workLogRepository = workLogRepository;
        this.notificationRepository = notificationRepository;
    }

    public DashboardSummaryResponse getSummary() {
        LocalDate today = LocalDate.now();
        List<Intern> interns = internRepository.findAll();
        List<Project> projects = projectRepository.findAll();
        List<Task> tasks = taskRepository.findAll();
        List<DailyWorkLog> workLogs = workLogRepository.findAll();

        Map<String, String> internNames = interns.stream()
                .filter(i -> i.getId() != null)
                .collect(Collectors.toMap(Intern::getId, Intern::getFullName, (a, b) -> a));

        DashboardSummaryResponse response = new DashboardSummaryResponse();
        response.setTotalInterns(interns.size());
        response.setActiveProjects(projects.stream()
                .filter(p -> p.getStatus() == ProjectStatus.IN_PROGRESS
                        || p.getStatus() == ProjectStatus.PLANNED)
                .count());
        response.setCompletedTasks(tasks.stream()
                .filter(t -> t.getStatus() == TaskStatus.COMPLETED)
                .count());
        response.setPendingTasks(tasks.stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED)
                .count());
        response.setOverdueTasks(tasks.stream()
                .filter(t -> isOverdue(t, today))
                .count());
        response.setTodaysWorkLogs(workLogs.stream()
                .filter(l -> isTodaysWorkLog(l, today))
                .count());
        response.setRecentActivities(buildRecentActivities());
        response.setUpcomingDeadlines(buildUpcomingDeadlines(tasks, internNames, today));
        return response;
    }

    private List<DashboardActivityItem> buildRecentActivities() {
        return notificationRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .limit(8)
                .map(this::toActivityItem)
                .collect(Collectors.toList());
    }

    private DashboardActivityItem toActivityItem(Notification notification) {
        DashboardActivityItem item = new DashboardActivityItem();
        item.setId(notification.getId());
        item.setType(notification.getType() != null ? notification.getType().name() : null);
        item.setTitle(notification.getTitle());
        item.setMessage(notification.getMessage());
        item.setHref(resolveHref(notification));
        item.setCreatedAt(notification.getCreatedAt());
        return item;
    }

    private String resolveHref(Notification notification) {
        NotificationType type = notification.getType();
        if (type == NotificationType.WORK_SUBMITTED
                && notification.getRelatedSubmissionId() != null) {
            return "/admin/submissions/" + notification.getRelatedSubmissionId() + "/review";
        }
        if (type == NotificationType.WORK_LOG_SUBMITTED) {
            return "/admin/work-logs";
        }
        return "/admin/notifications";
    }

    private List<DashboardDeadlineItem> buildUpcomingDeadlines(
            List<Task> tasks,
            Map<String, String> internNames,
            LocalDate today
    ) {
        return tasks.stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED)
                .filter(t -> parseDate(t.getDeadline()) != null)
                .filter(t -> !parseDate(t.getDeadline()).isBefore(today))
                .sorted(Comparator.comparing(t -> parseDate(t.getDeadline())))
                .limit(8)
                .map(t -> {
                    DashboardDeadlineItem item = new DashboardDeadlineItem();
                    item.setTaskId(t.getId());
                    item.setTitle(t.getTitle());
                    item.setDeadline(t.getDeadline());
                    item.setStatus(t.getStatus() != null ? t.getStatus().name() : null);
                    item.setPriority(t.getPriority() != null ? t.getPriority().name() : null);
                    item.setInternName(
                            t.getAssignedInternId() != null
                                    ? internNames.getOrDefault(t.getAssignedInternId(), "—")
                                    : "Unassigned"
                    );
                    return item;
                })
                .collect(Collectors.toList());
    }

    private boolean isTodaysWorkLog(DailyWorkLog log, LocalDate today) {
        LocalDate logDate = parseDate(log.getLogDate());
        if (today.equals(logDate)) {
            return true;
        }
        return isCreatedToday(log.getCreatedAt(), today);
    }

    private boolean isCreatedToday(Instant createdAt, LocalDate today) {
        if (createdAt == null) {
            return false;
        }
        LocalDate createdDate = LocalDate.ofInstant(createdAt, ZoneOffset.UTC);
        return today.equals(createdDate);
    }

    private boolean isOverdue(Task task, LocalDate today) {
        if (task.getStatus() == TaskStatus.COMPLETED) {
            return false;
        }
        LocalDate deadline = parseDate(task.getDeadline());
        return deadline != null && deadline.isBefore(today);
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
}
