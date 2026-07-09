import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserSession } from '../../services/auth.service';
import { ConsultaService, Consulta, UsuarioInfo } from '../../services/consulta.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: UserSession | null = null;
  
  // Listas de dados
  consultas: Consulta[] = [];
  psicologos: UsuarioInfo[] = [];
  pacientes: UsuarioInfo[] = [];
  usuarios: UsuarioInfo[] = []; // Exclusivo Supervisão

  // Formulário de Agendamento (Paciente / Recepção)
  agendamento = {
    pacienteId: 0,
    psicologoId: 0,
    dataHora: '',
    observacoes: ''
  };

  // Edição de Prontuário (Psicólogo)
  modalProntuario = {
    aberto: false,
    consultaId: 0,
    pacienteNome: '',
    diagnostico: '',
    observacoes: ''
  };

  // Visualização de Prontuário (Paciente / Geral)
  modalVerProntuario = {
    aberto: false,
    diagnostico: '',
    observacoes: '',
    psicologoNome: '',
    dataHora: ''
  };

  // Métricas para Supervisão
  metricas = {
    totalConsultas: 0,
    totalPacientes: 0,
    totalPsicologos: 0,
    realizadas: 0,
    canceladas: 0,
    agendadas: 0
  };

  sucessoMsg = '';
  erroMsg = '';
  carregando = false;

  constructor(
    private authService: AuthService,
    private consultaService: ConsultaService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.carregarDados();
  }

  logout(): void {
    this.authService.logout();
  }

  carregarDados(): void {
    if (!this.currentUser) return;
    
    this.carregando = true;
    this.erroMsg = '';
    this.sucessoMsg = '';

    const role = this.currentUser.role;

    if (role === 'PACIENTE') {
      // Carrega consultas do paciente
      this.consultaService.listarPorPaciente(this.currentUser.id).subscribe({
        next: (data) => {
          this.consultas = data.sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
          this.carregando = false;
        },
        error: (err) => this.handleError('Erro ao carregar consultas', err)
      });
      // Carrega psicólogos para agendamento
      this.usuarioService.listarPorRole('PSICOLOGO').subscribe({
        next: (data) => this.psicologos = data,
        error: (err) => console.error(err)
      });
    } 
    else if (role === 'PSICOLOGO') {
      // Carrega consultas do psicólogo
      this.consultaService.listarPorPsicologo(this.currentUser.id).subscribe({
        next: (data) => {
          this.consultas = data.sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
          this.carregando = false;
        },
        error: (err) => this.handleError('Erro ao carregar agenda', err)
      });
    } 
    else if (role === 'RECEPCAO') {
      // Carrega todas as consultas
      this.consultaService.listarTodas().subscribe({
        next: (data) => {
          this.consultas = data.sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime());
          this.carregando = false;
        },
        error: (err) => this.handleError('Erro ao carregar painel geral', err)
      });
      // Carrega psicólogos e pacientes
      this.usuarioService.listarPorRole('PSICOLOGO').subscribe({
        next: (data) => this.psicologos = data,
        error: (err) => console.error(err)
      });
      this.usuarioService.listarPorRole('PACIENTE').subscribe({
        next: (data) => this.pacientes = data,
        error: (err) => console.error(err)
      });
    } 
    else if (role === 'SUPERVISAO') {
      // Carrega todos os usuários
      this.usuarioService.listarTodos().subscribe({
        next: (data) => {
          this.usuarios = data;
          this.metricas.totalPacientes = data.filter(u => u.role === 'PACIENTE').length;
          this.metricas.totalPsicologos = data.filter(u => u.role === 'PSICOLOGO').length;
        },
        error: (err) => console.error(err)
      });
      // Carrega todas as consultas para métricas
      this.consultaService.listarTodas().subscribe({
        next: (data) => {
          this.consultas = data;
          this.metricas.totalConsultas = data.length;
          this.metricas.realizadas = data.filter(c => c.status === 'REALIZADA').length;
          this.metricas.canceladas = data.filter(c => c.status === 'CANCELADA').length;
          this.metricas.agendadas = data.filter(c => c.status === 'AGENDADA' || c.status === 'CONFIRMADA').length;
          this.carregando = false;
        },
        error: (err) => this.handleError('Erro ao carregar métricas', err)
      });
    }
  }

  // Agendamento (Paciente / Recepção)
  agendarConsulta(): void {
    if (!this.currentUser) return;
    
    let pacId = this.agendamento.pacienteId;
    let psicId = this.agendamento.psicologoId;
    
    // Se for Paciente, ele agenda para si mesmo
    if (this.currentUser.role === 'PACIENTE') {
      pacId = this.currentUser.id;
    }

    if (!pacId || !psicId || !this.agendamento.dataHora) {
      this.erroMsg = 'Por favor, selecione o profissional, data e hora.';
      return;
    }

    // Formatar dataHora para LocalDateTime (adicionando segundos para evitar erros de parser do Java Jackson)
    let dtFormatted = this.agendamento.dataHora;
    if (dtFormatted.length === 16) {
      dtFormatted += ':00';
    }

    const payload = {
      paciente: { id: pacId },
      psicologo: { id: psicId },
      dataHora: dtFormatted,
      observacoes: this.agendamento.observacoes,
      status: 'AGENDADA'
    };

    this.consultaService.agendar(payload).subscribe({
      next: () => {
        this.sucessoMsg = 'Consulta agendada com sucesso!';
        this.agendamento = { pacienteId: 0, psicologoId: 0, dataHora: '', observacoes: '' };
        this.carregarDados();
      },
      error: (err) => this.handleError('Falha ao agendar consulta', err)
    });
  }

  // Ações de status
  alterarStatus(id: number | undefined, status: string): void {
    if (!id) return;
    this.consultaService.atualizarStatus(id, status).subscribe({
      next: () => {
        this.sucessoMsg = `Status da consulta atualizado para ${status}!`;
        this.carregarDados();
      },
      error: (err) => this.handleError('Erro ao alterar status', err)
    });
  }

  // Abrir Modal de Edição de Prontuário (Psicólogo)
  abrirModalProntuario(consulta: Consulta): void {
    if (!consulta.id) return;
    this.modalProntuario = {
      aberto: true,
      consultaId: consulta.id,
      pacienteNome: consulta.paciente.nome,
      diagnostico: consulta.diagnostico || '',
      observacoes: consulta.observacoes || ''
    };
  }

  fecharModalProntuario(): void {
    this.modalProntuario.aberto = false;
  }

  salvarProntuario(): void {
    this.consultaService.atualizarProntuario(
      this.modalProntuario.consultaId,
      this.modalProntuario.diagnostico,
      this.modalProntuario.observacoes
    ).subscribe({
      next: () => {
        this.sucessoMsg = 'Prontuário e observações atualizados com sucesso!';
        this.fecharModalProntuario();
        // Se a consulta ainda estiver AGENDADA ou CONFIRMADA, ao registrar prontuário pode ser bom já mudar status para REALIZADA
        const consulta = this.consultas.find(c => c.id === this.modalProntuario.consultaId);
        if (consulta && consulta.status !== 'REALIZADA') {
          this.alterarStatus(this.modalProntuario.consultaId, 'REALIZADA');
        } else {
          this.carregarDados();
        }
      },
      error: (err) => this.handleError('Erro ao atualizar prontuário', err)
    });
  }

  // Visualizar Prontuário (Paciente)
  verProntuario(consulta: Consulta): void {
    this.modalVerProntuario = {
      aberto: true,
      diagnostico: consulta.diagnostico || 'Nenhum diagnóstico registrado ainda.',
      observacoes: consulta.observacoes || 'Nenhuma nota registrada.',
      psicologoNome: consulta.psicologo.nome,
      dataHora: consulta.dataHora
    };
  }

  fecharVerProntuario(): void {
    this.modalVerProntuario.aberto = false;
  }

  // Supervisão: Deletar Usuário
  deletarUsuario(id: number): void {
    if (!confirm('Tem certeza que deseja excluir permanentemente este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    this.usuarioService.deletar(id).subscribe({
      next: () => {
        this.sucessoMsg = 'Usuário excluído com sucesso.';
        this.carregarDados();
      },
      error: (err) => this.handleError('Falha ao excluir usuário', err)
    });
  }

  // Helpers
  private handleError(context: string, err: any): void {
    this.carregando = false;
    if (err.error && typeof err.error === 'string') {
      this.erroMsg = `${context}: ${err.error}`;
    } else {
      this.erroMsg = `${context}.`;
    }
    console.error(err);
  }

  formatarData(dataStr: string): string {
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  traduzirStatus(status: string): string {
    switch (status) {
      case 'AGENDADA': return 'Agendada';
      case 'CONFIRMADA': return 'Confirmada';
      case 'REALIZADA': return 'Realizada';
      case 'CANCELADA': return 'Cancelada';
      default: return status;
    }
  }
}
