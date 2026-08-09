package com.internship.backend.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.internship.backend.model.Notification;
import com.internship.backend.model.NotificationType;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);

    long countByRecipientEmailAndReadFalse(String recipientEmail);

    List<Notification> findByRecipientEmailAndReadFalse(String recipientEmail);

    List<Notification> findAllByOrderByCreatedAtDesc();

    boolean existsByRecipientEmailAndTypeAndRelatedTaskIdAndCreatedAtAfter(
            String recipientEmail,
            NotificationType type,
            String relatedTaskId,
            Instant createdAtAfter
    );
}
