package com.internship.backend.config;

import org.bson.Document;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class StartupMessage {

	private final Environment environment;
	private final MongoTemplate mongoTemplate;

	public StartupMessage(Environment environment, MongoTemplate mongoTemplate) {
		this.environment = environment;
		this.mongoTemplate = mongoTemplate;
	}

	@EventListener(ApplicationReadyEvent.class)
	public void onReady() {
		String port = environment.getProperty("local.server.port", environment.getProperty("server.port", "8080"));
		System.out.println("Backend server running on http://localhost:" + port);

		try {
			Document ping = mongoTemplate.getDb().runCommand(new Document("ping", 1));
			Object ok = ping.get("ok");
			if (ok instanceof Number number && number.intValue() == 1) {
				System.out.println("MongoDB connected successfully");
			}
			else {
				System.out.println("MongoDB connection failed: unexpected ping response");
			}
		}
		catch (Exception ex) {
			System.out.println("MongoDB connection failed: " + ex.getMessage());
		}
	}

}
