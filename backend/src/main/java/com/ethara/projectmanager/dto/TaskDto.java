package com.ethara.projectmanager.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private LocalDate dueDate;
    private Long projectId;
    private Long assigneeId;
    private String assigneeName;
}
