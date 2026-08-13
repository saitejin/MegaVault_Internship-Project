package com.megavault;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.megavault", "controller", "entity", "exceptionhandler", "repository", "service", "utils", "dto"})
@EntityScan(basePackages = {"entity"})
@EnableJpaRepositories(basePackages = {"repository"})
public class MegavaultApplication {

    public static void main(String[] args) {
        SpringApplication.run(MegavaultApplication.class, args);
        System.out.println("🚀 MegaVault Spring Boot Backend Started Successfully!");
        System.out.println("📡 REST API Server: http://localhost:8080");
    }
}
