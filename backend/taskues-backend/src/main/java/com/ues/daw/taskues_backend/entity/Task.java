package com.ues.daw.taskues_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "task")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Long taskId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "init_date")
    private LocalDateTime initDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "task_state_enum")
    @Builder.Default
    private TaskState state = TaskState.TODO;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "category_id", nullable = false)
    private Integer categoryId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "date_created", nullable = false, updatable = false)
    private LocalDateTime dateCreated;

    @Column(name = "date_update", nullable = false)
    private LocalDateTime dateUpdate;

    @PrePersist
    public void prePersist() {
        this.dateCreated = LocalDateTime.now();
        this.dateUpdate  = LocalDateTime.now();
        if (this.state == null) this.state = TaskState.TODO;
    }

    @PreUpdate
    public void preUpdate() {
        this.dateUpdate = LocalDateTime.now();
    }
}