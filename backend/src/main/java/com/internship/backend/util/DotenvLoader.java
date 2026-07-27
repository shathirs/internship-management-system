package com.internship.backend.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public final class DotenvLoader {

	private DotenvLoader() {
	}

	public static void load() {
		Path envFile = findEnvFile();
		if (envFile == null) {
			return;
		}

		try {
			List<String> lines = Files.readAllLines(envFile);
			for (String line : lines) {
				line = line.trim();
				if (line.isEmpty() || line.startsWith("#")) {
					continue;
				}

				int separatorIndex = line.indexOf('=');
				if (separatorIndex <= 0) {
					continue;
				}

				String key = line.substring(0, separatorIndex).trim();
				String value = line.substring(separatorIndex + 1).trim();
				System.setProperty(key, value);
			}
		}
		catch (IOException ex) {
			throw new IllegalStateException("Failed to load .env file from " + envFile, ex);
		}
	}

	private static Path findEnvFile() {
		Path currentDirEnv = Path.of(System.getProperty("user.dir"), ".env");
		if (Files.isRegularFile(currentDirEnv)) {
			return currentDirEnv;
		}

		Path backendEnv = Path.of(System.getProperty("user.dir"), "backend", ".env");
		if (Files.isRegularFile(backendEnv)) {
			return backendEnv;
		}

		return null;
	}

}
