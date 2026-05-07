package com.ethara.projectmanager.service;

import com.ethara.projectmanager.dto.ProjectDto;
import com.ethara.projectmanager.entity.Project;
import com.ethara.projectmanager.entity.User;
import com.ethara.projectmanager.repository.ProjectRepository;
import com.ethara.projectmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ProjectDto getProjectById(Long id) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        return mapToDto(project);
    }

    public ProjectDto createProject(ProjectDto projectDto, String createdByEmail) {
        User user = userRepository.findByEmail(createdByEmail).orElseThrow(() -> new RuntimeException("User not found"));
        
        Project project = new Project();
        project.setTitle(projectDto.getTitle());
        project.setDescription(projectDto.getDescription());
        project.setCreatedBy(user);
        
        Project savedProject = projectRepository.save(project);
        return mapToDto(savedProject);
    }

    public ProjectDto updateProject(Long id, ProjectDto projectDto) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        project.setTitle(projectDto.getTitle());
        project.setDescription(projectDto.getDescription());
        
        Project savedProject = projectRepository.save(project);
        return mapToDto(savedProject);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    private ProjectDto mapToDto(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setCreatedById(project.getCreatedBy().getId());
        dto.setCreatedByName(project.getCreatedBy().getName());
        return dto;
    }
}
