import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Aluno } from '../models/Aluno';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  baseURL = `${environment.mainUrlAPI}alunos`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(this.baseURL);
  }

  getById(id: number): Observable<Aluno> {
    return this.http.get<Aluno>(`${this.baseURL}/${id}`);
  }

  getByDisciplinaId(id: number): Observable<Aluno[]> {
    return this.http.get<Aluno[]>(`${this.baseURL}/ByDisciplina/${id}`);
  }

  post(aluno: Aluno) {
    return this.http.post(this.baseURL, aluno);
  }

  put(aluno: Aluno) {
    return this.http.put(`${this.baseURL}/${aluno.id}`, aluno);
  }

  desativarAluno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`);
  }

  ativarAluno(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseURL}/ativar/${id}`, null);
  }

  toggleAtivo(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseURL}/toggle-ativo/${id}`, null);
  }
  

}
