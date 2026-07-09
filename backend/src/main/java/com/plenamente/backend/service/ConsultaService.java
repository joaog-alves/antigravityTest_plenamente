package com.plenamente.backend.service;

import com.plenamente.backend.model.Consulta;
import com.plenamente.backend.model.StatusConsulta;
import com.plenamente.backend.repository.ConsultaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConsultaService {

    @Autowired
    private ConsultaRepository consultaRepository;

    public Consulta agendar(Consulta consulta) {
        if (consulta.getStatus() == null) {
            consulta.setStatus(StatusConsulta.AGENDADA);
        }
        return consultaRepository.save(consulta);
    }

    public List<Consulta> listarTodas() {
        return consultaRepository.findAll();
    }

    public List<Consulta> listarPorPaciente(Long pacienteId) {
        return consultaRepository.findByPacienteId(pacienteId);
    }

    public List<Consulta> listarPorPsicologo(Long psicologoId) {
        return consultaRepository.findByPsicologoId(psicologoId);
    }

    public Optional<Consulta> buscarPorId(Long id) {
        return consultaRepository.findById(id);
    }

    public Consulta atualizarStatus(Long id, StatusConsulta status) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));
        consulta.setStatus(status);
        return consultaRepository.save(consulta);
    }

    public Consulta salvarDiagnosticoENotas(Long id, String diagnostico, String observacoes) {
        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consulta não encontrada"));
        if (diagnostico != null) {
            consulta.setDiagnostico(diagnostico);
        }
        if (observacoes != null) {
            consulta.setObservacoes(observacoes);
        }
        return consultaRepository.save(consulta);
    }
}
