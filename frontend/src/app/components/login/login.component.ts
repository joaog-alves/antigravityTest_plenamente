import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  senha = '';
  erro = '';
  carregando = false;

  // Credenciais de teste
  seedUsers = [
    { label: 'Paciente (João)', email: 'paciente@plenamente.com', senha: 'senha123', role: 'PACIENTE' },
    { label: 'Psicólogo (Lucas)', email: 'psicologo@plenamente.com', senha: 'senha123', role: 'PSICOLOGO' },
    { label: 'Recepção (Maria)', email: 'recepcao@plenamente.com', senha: 'senha123', role: 'RECEPCAO' },
    { label: 'Supervisão (Ana)', email: 'supervisao@plenamente.com', senha: 'senha123', role: 'SUPERVISAO' }
  ];

  constructor(private authService: AuthService, private router: Router) {
    // Se já estiver logado, vai pro dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  preencherTeste(user: any): void {
    this.email = user.email;
    this.senha = user.senha;
    this.erro = '';
  }

  onSubmit(): void {
    if (!this.email || !this.senha) {
      this.erro = 'Por favor, preencha todos os campos.';
      return;
    }

    this.carregando = true;
    this.erro = '';

    this.authService.login({ email: this.email, password: this.senha }).subscribe({
      next: (session) => {
        this.carregando = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.carregando = false;
        if (err.status === 401 || err.status === 400) {
          this.erro = 'E-mail ou senha incorretos.';
        } else {
          this.erro = 'Falha ao conectar com o servidor. Verifique se o backend está ativo.';
        }
        console.error(err);
      }
    });
  }
}
