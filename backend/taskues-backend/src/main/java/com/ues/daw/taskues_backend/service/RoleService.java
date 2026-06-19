package com.ues.daw.taskues_backend.service;

import java.util.List;
import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.ues.daw.taskues_backend.dto.RoleDTO;
import com.ues.daw.taskues_backend.entity.Role;
import com.ues.daw.taskues_backend.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleService {
    
        private final RoleRepository roleRepository;
   
        final RoleDTO toDTO(Role role) {
            return RoleDTO.builder()
                    .roleId(role.getRoleId())
                    .name(role.getName())
                    .description(role.getDescription())
                    .build();
        }

        final Role toEntity(RoleDTO roleDTO) {
            return Role.builder()
                    .roleId(roleDTO.getRoleId())
                    .name(roleDTO.getName())
                    .description(roleDTO.getDescription())
                    .build();
        }

        public List<RoleDTO> findAll() {
            return roleRepository.findAll()
            .stream()
            .map(this::toDTO)
            .toList();
        }

        public RoleDTO findById(Long id) {
            return roleRepository.findById(id)
            .map(this::toDTO)
            .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        }

        // guardar un nuevo rol
        public RoleDTO save (RoleDTO roleDTO) {
            Role role = roleRepository.save(toEntity(roleDTO));
            return toDTO(role);
        }

        // actualizar un rol existente
        public RoleDTO update (Long id,RoleDTO roleDTO) {
            Role role = roleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

            role.setName(roleDTO.getName());
            role.setDescription(roleDTO.getDescription());

            return toDTO(roleRepository.save(role));
        }   

        // eliminar un rol por su ID
        public void deleteById(Long id) {
            if (!roleRepository.existsById(id)) {
                throw new RuntimeException("Rol no encontrado");
            }
            roleRepository.deleteById(id);
        }

    }