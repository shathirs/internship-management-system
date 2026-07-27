package com.internship.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

	@Value("${server.port:8080}")
	private String port;

	@GetMapping("/")
	public String home() {
		return "Backend server running on http://localhost:" + port;
	}

}
