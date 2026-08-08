package com.internship.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.internship.backend.util.DotenvLoader;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {

	public static void main(String[] args) {
		DotenvLoader.load();
		SpringApplication.run(BackendApplication.class, args);
	}

}
