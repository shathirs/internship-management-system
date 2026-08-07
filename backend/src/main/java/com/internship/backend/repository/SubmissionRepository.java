package com.internship.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.internship.backend.model.Submission;
import com.internship.backend.model.SubmissionStatus;

public interface SubmissionRepository extends MongoRepository<Submission, String> {

    List<Submission> findByInternId(String internId);

    List<Submission> findByStatus(SubmissionStatus status);

    List<Submission> findByTaskId(String taskId);

    List<Submission> findByInternIdOrderByCreatedAtDesc(String internId);
}
