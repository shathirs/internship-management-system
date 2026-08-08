package com.internship.backend.service;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.internship.backend.dto.AssignTaskRequest;
import com.internship.backend.dto.CreateTaskRequest;
import com.internship.backend.dto.TaskResponse;
import com.internship.backend.dto.UpdateTaskRequest;
import com.internship.backend.model.Intern;
import com.internship.backend.model.NotificationType;
import com.internship.backend.model.Task;
import com.internship.backend.model.TaskPriority;
import com.internship.backend.model.TaskStatus;
import com.internship.backend.repository.InternRepository;
import com.internship.backend.repository.ProjectRepository;
import com.internship.backend.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final InternRepository internRepository;
    private final ProjectRepository projectRepository;
    private final NotificationService notificationService;

    public TaskService(
            TaskRepository taskRepository,
            InternRepository internRepository,
            ProjectRepository projectRepository,
            NotificationService notificationService
    ) {
        this.taskRepository = taskRepository;
        this.internRepository = internRepository;
        this.projectRepository = projectRepository;
        this.notificationService = notificationService;
    }

    public List<TaskResponse> getAll(String search, String status, String projectId) {
        List<Task> tasks;

        if (search != null && !search.isBlank()) {
            tasks = taskRepository.findByTitleContainingIgnoreCase(search.trim());
        } else if (status != null && !status.isBlank()) {
            tasks = taskRepository.findByStatus(
                    TaskStatus.valueOf(status.trim().toUpperCase())
            );
        } else if (projectId != null && !projectId.isBlank()) {
            tasks = taskRepository.findByProjectId(projectId.trim());
        } else {
            tasks = taskRepository.findAll();
        }

        if (status != null && !status.isBlank() && search != null && !search.isBlank()) {
            TaskStatus st = TaskStatus.valueOf(status.trim().toUpperCase());
            tasks = tasks.stream()
                    .filter(t -> t.getStatus() == st)
                    .collect(Collectors.toList());
        }

        if (projectId != null && !projectId.isBlank()
                && (search != null && !search.isBlank() || status != null && !status.isBlank())) {
            String pid = projectId.trim();
            tasks = tasks.stream()
                    .filter(t -> pid.equals(t.getProjectId()))
                    .collect(Collectors.toList());
        }

        return tasks.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<TaskResponse> getMyTasks(String email) {
        Intern intern = internRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Intern profile not found"));
        return taskRepository.findByAssignedInternId(intern.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse getById(String id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        return toResponse(task);
    }

    public TaskResponse create(CreateTaskRequest request) {
        validateProjectId(request.getProjectId());
        validateInternId(request.getAssignedInternId());

        Instant now = Instant.now();
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(
                request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM
        );
        task.setStatus(
                request.getStatus() != null ? request.getStatus() : TaskStatus.TODO
        );
        task.setDeadline(request.getDeadline());
        task.setAssignedInternId(blankToNull(request.getAssignedInternId()));
        task.setProjectId(request.getProjectId());
        task.setCreatedAt(now);
        task.setUpdatedAt(now);

        task = taskRepository.save(task);
        notifyTaskAssigned(task);
        return toResponse(task);
    }

    public TaskResponse update(String id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        validateProjectId(request.getProjectId());
        validateInternId(request.getAssignedInternId());

        String previousAssignee = task.getAssignedInternId();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        task.setDeadline(request.getDeadline());
        task.setAssignedInternId(blankToNull(request.getAssignedInternId()));
        task.setProjectId(request.getProjectId());
        task.setUpdatedAt(Instant.now());

        task = taskRepository.save(task);

        String newAssignee = task.getAssignedInternId();
        if (newAssignee != null && !Objects.equals(newAssignee, previousAssignee)) {
            notifyTaskAssigned(task);
        }

        return toResponse(task);
    }

    public TaskResponse assign(String id, AssignTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        validateInternId(request.getAssignedInternId());
        task.setAssignedInternId(request.getAssignedInternId());
        task.setUpdatedAt(Instant.now());

        task = taskRepository.save(task);
        notifyTaskAssigned(task);
        return toResponse(task);
    }

    public void delete(String id) {
        if (!taskRepository.existsById(id)) {
            throw new IllegalArgumentException("Task not found");
        }
        taskRepository.deleteById(id);
    }

    private void notifyTaskAssigned(Task task) {
        if (task.getAssignedInternId() == null || task.getAssignedInternId().isBlank()) {
            return;
        }

        Intern intern = internRepository.findById(task.getAssignedInternId()).orElse(null);
        if (intern == null || intern.getEmail() == null || intern.getEmail().isBlank()) {
            return;
        }

        String deadlinePart = (task.getDeadline() != null && !task.getDeadline().isBlank())
                ? " Deadline: " + task.getDeadline() + "."
                : "";

        notificationService.create(
                intern.getEmail(),
                NotificationType.TASK_ASSIGNED,
                "New task assigned",
                "You have been assigned: \"" + task.getTitle() + "\"." + deadlinePart,
                task.getId(),
                null,
                intern.getId()
        );
    }

    private void validateProjectId(String projectId) {
        if (projectId == null || projectId.isBlank() || !projectRepository.existsById(projectId)) {
            throw new IllegalArgumentException("Project not found");
        }
    }

    private void validateInternId(String internId) {
        if (internId == null || internId.isBlank()) {
            return;
        }
        if (!internRepository.existsById(internId)) {
            throw new IllegalArgumentException("Intern not found: " + internId);
        }
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }

    private TaskResponse toResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setPriority(task.getPriority());
        response.setStatus(task.getStatus());
        response.setDeadline(task.getDeadline());
        response.setAssignedInternId(task.getAssignedInternId());
        response.setProjectId(task.getProjectId());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        return response;
    }
}
