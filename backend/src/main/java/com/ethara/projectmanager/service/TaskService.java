package com.ethara.projectmanager.service;

import com.ethara.projectmanager.dto.TaskDto;
import com.ethara.projectmanager.entity.Priority;
import com.ethara.projectmanager.entity.Project;
import com.ethara.projectmanager.entity.Status;
import com.ethara.projectmanager.entity.Task;
import com.ethara.projectmanager.entity.User;
import com.ethara.projectmanager.repository.ProjectRepository;
import com.ethara.projectmanager.repository.TaskRepository;
import com.ethara.projectmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<TaskDto> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<TaskDto> getTasksByAssigneeId(Long assigneeId) {
        return taskRepository.findByAssigneeId(assigneeId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public TaskDto getTaskById(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        return mapToDto(task);
    }

    public TaskDto createTask(TaskDto taskDto) {
        Project project = projectRepository.findById(taskDto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        User assignee = null;
        if (taskDto.getAssigneeId() != null) {
            assignee = userRepository.findById(taskDto.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
        }

        Task task = new Task();
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setStatus(Status.valueOf(taskDto.getStatus()));
        task.setPriority(Priority.valueOf(taskDto.getPriority()));
        task.setDueDate(taskDto.getDueDate());
        task.setProject(project);
        task.setAssignee(assignee);

        Task savedTask = taskRepository.save(task);
        return mapToDto(savedTask);
    }

    public TaskDto updateTask(Long id, TaskDto taskDto) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        
        if (taskDto.getAssigneeId() != null) {
            User assignee = userRepository.findById(taskDto.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            task.setAssignee(assignee);
        } else {
            task.setAssignee(null);
        }

        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        if (taskDto.getStatus() != null) task.setStatus(Status.valueOf(taskDto.getStatus()));
        if (taskDto.getPriority() != null) task.setPriority(Priority.valueOf(taskDto.getPriority()));
        task.setDueDate(taskDto.getDueDate());
        
        Task savedTask = taskRepository.save(task);
        return mapToDto(savedTask);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    private TaskDto mapToDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus().name());
        dto.setPriority(task.getPriority().name());
        dto.setDueDate(task.getDueDate());
        dto.setProjectId(task.getProject().getId());
        
        if (task.getAssignee() != null) {
            dto.setAssigneeId(task.getAssignee().getId());
            dto.setAssigneeName(task.getAssignee().getName());
        }
        return dto;
    }
}
