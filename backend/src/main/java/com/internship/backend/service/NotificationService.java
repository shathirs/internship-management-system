package com.internship.backend.service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.internship.backend.dto.NotificationResponse;
import com.internship.backend.model.Intern;
import com.internship.backend.model.Notification;
import com.internship.backend.model.NotificationType;
import com.internship.backend.model.Role;
import com.internship.backend.model.Task;
import com.internship.backend.model.TaskStatus;
import com.internship.backend.model.User;
import com.internship.backend.repository.InternRepository;
import com.internship.backend.repository.NotificationRepository;
import com.internship.backend.repository.TaskRepository;
import com.internship.backend.repository.UserRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final TaskRepository taskRepository;
    private final InternRepository internRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            TaskRepository taskRepository,
            InternRepository internRepository,
            UserRepository userRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.taskRepository = taskRepository;
        this.internRepository = internRepository;
        this.userRepository = userRepository;
    }

    public NotificationResponse create(
            String recipientEmail,
            NotificationType type,
            String title,
            String message,
            String relatedTaskId,
            String relatedSubmissionId,
            String relatedInternId
    ) {
        Notification notification = new Notification();
        notification.setRecipientEmail(recipientEmail);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRelatedTaskId(relatedTaskId);
        notification.setRelatedSubmissionId(relatedSubmissionId);
        notification.setRelatedInternId(relatedInternId);
        notification.setRead(false);
        notification.setCreatedAt(Instant.now());
        return toResponse(notificationRepository.save(notification));
    }

    public void notifyAllAdmins(
            NotificationType type,
            String title,
            String message,
            String relatedTaskId,
            String relatedSubmissionId,
            String relatedInternId
    ) {
        for (User admin : userRepository.findByRole(Role.ADMIN)) {
            if (admin.getEmail() == null || admin.getEmail().isBlank()) {
                continue;
            }
            create(
                    admin.getEmail(),
                    type,
                    title,
                    message,
                    relatedTaskId,
                    relatedSubmissionId,
                    relatedInternId
            );
        }
    }

    public void sendDeadlineReminders(int daysAhead) {
        LocalDate today = LocalDate.now();
        LocalDate limit = today.plusDays(daysAhead);
        Instant since = Instant.now().minus(20, ChronoUnit.HOURS);

        for (Task task : taskRepository.findAll()) {
            if (task.getStatus() == TaskStatus.COMPLETED) {
                continue;
            }
            if (task.getAssignedInternId() == null || task.getAssignedInternId().isBlank()) {
                continue;
            }
            if (task.getDeadline() == null || task.getDeadline().isBlank()) {
                continue;
            }

            LocalDate deadline;
            try {
                deadline = LocalDate.parse(task.getDeadline());
            } catch (Exception ex) {
                continue;
            }

            if (deadline.isBefore(today) || deadline.isAfter(limit)) {
                continue;
            }

            Intern intern = internRepository.findById(task.getAssignedInternId()).orElse(null);
            if (intern == null || intern.getEmail() == null || intern.getEmail().isBlank()) {
                continue;
            }

            boolean alreadySent = notificationRepository
                    .existsByRecipientEmailAndTypeAndRelatedTaskIdAndCreatedAtAfter(
                            intern.getEmail(),
                            NotificationType.DEADLINE_REMINDER,
                            task.getId(),
                            since
                    );
            if (alreadySent) {
                continue;
            }

            String when = deadline.equals(today) ? "today" : "on " + deadline;
            create(
                    intern.getEmail(),
                    NotificationType.DEADLINE_REMINDER,
                    "Deadline reminder",
                    "Task \"" + task.getTitle() + "\" is due " + when + ".",
                    task.getId(),
                    null,
                    intern.getId()
            );
        }
    }

    public List<NotificationResponse> getMyNotifications(String email) {
        return notificationRepository
                .findByRecipientEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String email) {
        return notificationRepository.countByRecipientEmailAndReadFalse(email);
    }

    public NotificationResponse markRead(String id, String email) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        if (!email.equalsIgnoreCase(notification.getRecipientEmail())) {
            throw new IllegalArgumentException("Not allowed");
        }

        notification.setRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    public void markAllRead(String email) {
        List<Notification> unread =
                notificationRepository.findByRecipientEmailAndReadFalse(email);
        for (Notification notification : unread) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    private NotificationResponse toResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setType(notification.getType());
        response.setTitle(notification.getTitle());
        response.setMessage(notification.getMessage());
        response.setRelatedTaskId(notification.getRelatedTaskId());
        response.setRelatedSubmissionId(notification.getRelatedSubmissionId());
        response.setRelatedInternId(notification.getRelatedInternId());
        response.setRead(notification.isRead());
        response.setCreatedAt(notification.getCreatedAt());
        return response;
    }
}
