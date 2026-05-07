package com.ethara.projectmanager.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProjectDto {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private Long createdById;
    private String createdByName;
}
