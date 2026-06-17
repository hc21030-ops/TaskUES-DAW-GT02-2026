package com.ues.daw.taskues_backend.service;

import com.ues.daw.taskues_backend.dto.UserDTO;
import com.ues.daw.taskues_backend.entity.User;
import com.ues.daw.taskues_backend.entity.Role;
import com.ues.daw.taskues_backend.exception.ResourceNotFoundException;
import com.ues.daw.taskues_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    private UserDTO toDTO(User user) {
        return UserDTO.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .state(user.getState())
                .dateCreated(user.getDateCreated())
                .lastAccess(user.getLastAccess())
                .roles(user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()))
                .build();
    }

    private User toEntity(UserDTO dto, String passwordHash) {
        return User.builder()
                .userId(dto.getUserId())
                .name(dto.getName())
                .lastname(dto.getLastname())
                .email(dto.getEmail())
                .passwordHash(passwordHash)
                .state(dto.getState() != null ? dto.getState() : true)
                .lastAccess(LocalDateTime.now())
                .build();
    }

    public List<UserDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO findById(Long id) {
        return repository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public UserDTO save(UserDTO dto, String passwordHash) {
        User user = repository.save(toEntity(dto, passwordHash));
        return toDTO(user);
    }

    public UserDTO update(Long id, UserDTO dto) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario con id " + id + " no encontrado"));

        user.setName(dto.getName());
        user.setLastname(dto.getLastname());
        user.setEmail(dto.getEmail());
        user.setState(dto.getState() != null ? dto.getState() : user.getState());
        user.setLastAccess(LocalDateTime.now());

        return toDTO(repository.save(user));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario con id " + id + " no encontrado");
        }
        repository.deleteById(id);
    }
}