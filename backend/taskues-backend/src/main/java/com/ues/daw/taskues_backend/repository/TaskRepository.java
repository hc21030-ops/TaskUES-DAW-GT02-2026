package com.ues.daw.taskues_backend.repository;

import com.ues.daw.taskues_backend.entity.Task;
import com.ues.daw.taskues_backend.entity.TaskState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);

    List<Task> findByProjectIdAndState(Long projectId, TaskState state);

    List<Task> findByProjectIdAndUserId(Long projectId, Long userId);

    List<Task> findByUserId(Long userId);
}
