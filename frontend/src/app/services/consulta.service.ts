import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioInfo {
  id: number;
  nome: string;
  email: string;
  role: string;
  especialidade?: string;
  registroProfissional?: string;
  telefone?: string;
}

export interface Consulta {
  id?: number;
  paciente: UsuarioInfo;
  psicologo: UsuarioInfo;
  dataHora: string;
  status: string;
  observacoes?: string;
  diagnostico?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private apiUrl = 'http://localhost:8080/api/consultas';

  constructor(private http: HttpClient) {}

  agendar(consulta: any): Observable<Consulta> {
    return this.http.post<Consulta>(this.apiUrl, consulta);
  }

  listarTodas(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(this.apiUrl);
  }

  listarPorPaciente(pacienteId: number): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  listarPorPsicologo(psicologoId: number): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(`${this.apiUrl}/psicologo/${psicologoId}`);
  }

  atualizarStatus(id: number, status: string): Observable<Consulta> {
    let params = new HttpParams().set('status', status);
    return this.http.put<Consulta>(`${this.apiUrl}/${id}/status`, {}, { params });
  }

  atualizarProntuario(id: number, diagnostico?: string, observacoes?: string): Observable<Consulta> {
    let params = new HttpParams();
    if (diagnostico) {
      params = params.set('diagnostico', diagnostico);
    }
    if (observacoes) {
      params = params.set('observacoes', observacoes);
    }
    return this.http.put<Consulta>(`${this.apiUrl}/${id}/prontuario`, {}, { params });
  }
}
