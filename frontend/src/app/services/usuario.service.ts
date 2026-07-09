import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioInfo } from './consulta.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  buscarPorId(id: number): Observable<UsuarioInfo> {
    return this.http.get<UsuarioInfo>(`${this.apiUrl}/${id}`);
  }

  listarTodos(): Observable<UsuarioInfo[]> {
    return this.http.get<UsuarioInfo[]>(this.apiUrl);
  }

  listarPorRole(role: string): Observable<UsuarioInfo[]> {
    return this.http.get<UsuarioInfo[]>(`${this.apiUrl}/role/${role}`);
  }

  deletar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
