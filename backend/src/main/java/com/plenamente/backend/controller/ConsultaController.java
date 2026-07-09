package com.plenamente.backend.controller;

import com.plenamente.backend.model.Consulta;
import com.plenamente.backend.model.StatusConsulta;
import com.plenamente.backend.service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultas")
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    @PostMapping
    public ResponseEntity<?> agendar(@RequestBody Consulta consulta) {
        try {
            Consulta novaConsulta = consultaService.agendar(consulta);
            return ResponseEntity.ok(novaConsulta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Consulta>> listarTodas() {
        return ResponseEntity.ok(consultaService.listarTodas());
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<Consulta>> listarPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(consultaService.listarPorPaciente(pacienteId));
    }

    @GetMapping("/psicologo/{psicologoId}")
    public ResponseEntity<List<Consulta>> listarPorPsicologo(@PathVariable Long psicologoId) {
        return ResponseEntity.ok(consultaService.listarPorPsicologo(psicologoId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> atualizarStatus(@PathVariable Long id, @RequestParam StatusConsulta status) {
        try {
            Consulta consulta = consultaService.atualizarStatus(id, status);
            return ResponseEntity.ok(consulta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/prontuario")
    public ResponseEntity<?> atualizarProntuario(
            @PathVariable Long id,
            @RequestParam(required = false) String diagnostico,
            @RequestParam(required = false) String observacoes) {
        try {
            Consulta consulta = consultaService.salvarDiagnosticoENotas(id, diagnostico, observacoes);
            return ResponseEntity.ok(consulta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
