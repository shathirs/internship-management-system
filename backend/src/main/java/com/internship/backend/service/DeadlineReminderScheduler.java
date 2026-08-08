package com.internship.backend.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class DeadlineReminderScheduler {

    private final NotificationService notificationService;

    public DeadlineReminderScheduler(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /** Every day at 09:00 server time */
    @Scheduled(cron = "0 0 9 * * *")
    public void runDailyReminders() {
        notificationService.sendDeadlineReminders(1);
    }
}
