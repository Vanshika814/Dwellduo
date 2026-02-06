package com.dwellduo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main Spring Boot Application for DwellDuo
 * Roommate Matching Platform
 */
@SpringBootApplication
@EnableAsync
@EnableCaching
@EnableScheduling
public class DwellDuoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DwellDuoApplication.class, args);
    }
}



