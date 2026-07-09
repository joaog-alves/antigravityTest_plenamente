import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  role = 'PACIENTE';
  
  // Campos específicos
  telefone = '';
  especialidade = '';
  registroProfissional = '';

  erro = '';
  sucesso = false;
  carregando = false;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.nome || !this.email || !this.senha || !this.confirmarSenha) {
      this.erro = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem.';
      return;
    }

    this.carregando = true;
    this.erro = '';
    this.sucesso = false;

    // Constrói objeto de acordo com o modelo do backend Usuario
    const userData: any = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      role: this.role
    };

    if (this.role === 'PACIENTE') {
      userData.telefone = this.telefone;
    } else if (this.role === 'PSICOLOGO') {
      userData.especialidade = this.especialidade;
      userData.registroProfissional = this.registroProfissional;
    }

    this.authService.register(userData).subscribe({
      next: () => {
        this.carregando = false;
        this.sucesso = true;
        // Limpar campos
        this.nome = '';
        this.email = '';
        this.senha = '';
        this.confirmarSenha = '';
        this.telefone = '';
        this.especialidade = '';
        this.registroProfissional = '';
        
        // Redireciona após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.carregando = false;
        if (err.error && typeof err.error === 'string') {
          this.erro = err.error;
        } else {
          this.erro = 'Ocorreu um erro ao realizar o cadastro. Tente outro e-mail.';
        }
        console.error(err);
      }
    });
  }
}
