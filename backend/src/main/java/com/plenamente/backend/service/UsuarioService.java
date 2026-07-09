package com.plenamente.backend.service;

import com.plenamente.backend.model.Role;
import com.plenamente.backend.model.Usuario;
import com.plenamente.backend.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void seedDatabase() {
        if (usuarioRepository.count() == 0) {
            // Criando Paciente padrão
            Usuario paciente = new Usuario(null, "João Paciente", "paciente@plenamente.com", 
                    passwordEncoder.encode("senha123"), Role.PACIENTE);
            paciente.setTelefone("11999999999");
            usuarioRepository.save(paciente);

            // Criando Recepção padrão
            Usuario recepcao = new Usuario(null, "Maria Recepção", "recepcao@plenamente.com", 
                    passwordEncoder.encode("senha123"), Role.RECEPCAO);
            usuarioRepository.save(recepcao);

            // Criando Psicólogo padrão
            Usuario psicologo = new Usuario(null, "Dr. Lucas Psicólogo", "psicologo@plenamente.com", 
                    passwordEncoder.encode("senha123"), Role.PSICOLOGO);
            psicologo.setEspecialidade("Terapia Cognitivo Comportamental");
            psicologo.setRegistroProfissional("CRP-06/12345");
            usuarioRepository.save(psicologo);

            // Criando Supervisão padrão
            Usuario supervisao = new Usuario(null, "Ana Supervisora", "supervisao@plenamente.com", 
                    passwordEncoder.encode("senha123"), Role.SUPERVISAO);
            usuarioRepository.save(supervisao);
        }
    }

    public Usuario registrar(Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> listarPorRole(Role role) {
        return usuarioRepository.findByRole(role);
    }

    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }
}
