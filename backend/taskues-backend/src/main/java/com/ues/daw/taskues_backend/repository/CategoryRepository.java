package com.ues.daw.taskues_backend.repository;

import com.ues.daw.taskues_backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByProjectId(Long projectId);
}
