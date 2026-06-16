package com.ues.daw.taskues_backend.service;


import com.ues.daw.taskues_backend.dto.LoginDTO;
import com.ues.daw.taskues_backend.dto.RegisterDTO;
import com.ues.daw.taskues_backend.dto.UserDTO;
import com.ues.daw.taskues_backend.entity.Role;
import com.ues.daw.taskues_backend.entity.User;
import com.ues.daw.taskues_backend.exception.BusinessException;
import com.ues.daw.taskues_backend.repository.RoleRepository;
import com.ues.daw.taskues_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private static final String ROLE_BY_DEFAULT = "USER";

    public UserDTO register(RegisterDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new BusinessException("Ya existe un usuario registrado con ese email");
        }

        Role rolUsuario = roleRepository.findByName(ROLE_BY_DEFAULT)
                .orElseThrow(() -> new BusinessException(
                        "El rol por defecto '" + ROLE_BY_DEFAULT + "' no existe. Verifica el seed de roles (data.sql)."));

        Set<Role> roles = new HashSet<>();
        roles.add(rolUsuario);

        User nuevoUsuario = User.builder()
                .name(dto.getName())
                .lastname(dto.getLastname())
                .email(dto.getEmail())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .state(true)
                .lastAccess(LocalDateTime.now())
                .roles(roles)
                .build();

        User guardado = userRepository.save(nuevoUsuario);
        return toDTO(guardado);
    }

    public UserDTO login(LoginDTO dto) {
        User usuario = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new BusinessException("Email o contraseña incorrectos"));

        if (!passwordEncoder.matches(dto.getPassword(), usuario.getPasswordHash())) {
            throw new BusinessException("Email o contraseña incorrectos");
        }

        if (!Boolean.TRUE.equals(usuario.getState())) {
            throw new BusinessException("La cuenta de usuario está desactivada");
        }

        usuario.setLastAccess(LocalDateTime.now());
        userRepository.save(usuario);

        return toDTO(usuario);
    }

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
}
