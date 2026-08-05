package com.internship.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.internship.backend.model.Task;
import com.internship.backend.model.TaskStatus;

public interface TaskRepository extends MongoRepository<Task, String> {

    List<Task> findByStatus(TaskStatus status);

    List<Task> findByProjectId(String projectId);

    List<Task> findByAssignedInternId(String assignedInternId);

    List<Task> findByTitleContainingIgnoreCase(String title);
}
