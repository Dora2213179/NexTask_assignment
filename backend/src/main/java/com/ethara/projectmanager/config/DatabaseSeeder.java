package com.ethara.projectmanager.config;

import com.ethara.projectmanager.entity.*;
import com.ethara.projectmanager.repository.ProjectRepository;
import com.ethara.projectmanager.repository.TaskRepository;
import com.ethara.projectmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Seed Users
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@ethara.com")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);

            User member1 = User.builder()
                    .name("Manager Mike")
                    .email("manager@ethara.com")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.ROLE_MANAGER)
                    .build();
            userRepository.save(member1);

            User member2 = User.builder()
                    .name("Employee Emma")
                    .email("employee@ethara.com")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.ROLE_EMPLOYEE)
                    .build();
            userRepository.save(member2);

            // Seed Projects
            Project project1 = Project.builder()
                    .title("Website Redesign")
                    .description("Complete overhaul of the corporate website.")
                    .createdBy(admin)
                    .build();
            projectRepository.save(project1);

            Project project2 = Project.builder()
                    .title("Mobile App Development")
                    .description("Build the new iOS and Android application.")
                    .createdBy(admin)
                    .build();
            projectRepository.save(project2);

            // Seed Tasks
            Task task1 = Task.builder()
                    .title("Design Mockups")
                    .description("Create Figma mockups for the homepage.")
                    .status(Status.TODO)
                    .priority(Priority.HIGH)
                    .dueDate(LocalDate.now().plusDays(5))
                    .project(project1)
                    .assignee(member1)
                    .build();
            taskRepository.save(task1);

            Task task2 = Task.builder()
                    .title("Backend API Setup")
                    .description("Initialize Spring Boot project and DB.")
                    .status(Status.IN_PROGRESS)
                    .priority(Priority.HIGH)
                    .dueDate(LocalDate.now().plusDays(2))
                    .project(project2)
                    .assignee(member2)
                    .build();
            taskRepository.save(task2);

            Task task3 = Task.builder()
                    .title("User Research")
                    .description("Interview stakeholders for requirements.")
                    .status(Status.DONE)
                    .priority(Priority.MEDIUM)
                    .dueDate(LocalDate.now().minusDays(1))
                    .project(project1)
                    .assignee(admin)
                    .build();
            taskRepository.save(task3);
        }
    }
}
