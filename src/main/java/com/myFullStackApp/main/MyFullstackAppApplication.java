package com.myFullStackApp.main; // This is your actual package

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Use your CORRECT base package here
@SpringBootApplication(scanBasePackages = "com.myFullStackApp.main")
public class MyFullstackAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyFullstackAppApplication.class, args);
    }
}