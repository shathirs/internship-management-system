package com.internship.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.internship.backend.model.DailyWorkLog;
import com.internship.backend.model.WorkLogStatus;

public interface DailyWorkLogRepository extends MongoRepository<DailyWorkLog, String> {

    List<DailyWorkLog> findByInternId(String internId);

    List<DailyWorkLog> findByStatus(WorkLogStatus status);

    Optional<DailyWorkLog> findByInternIdAndLogDate(String internId, String logDate);

    List<DailyWorkLog> findByInternIdOrderByLogDateDesc(String internId);
}
