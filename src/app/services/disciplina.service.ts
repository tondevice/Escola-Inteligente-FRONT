import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Disciplina } from '../models/Disciplina';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService {
  baseURL = `${environment.mainUrlAPI}disciplinas`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Disciplina[]> {
    return this.http.get<Disciplina[]>(this.baseURL);
  }

  getById(id: number): Observable<Disciplina> {
    return this.http.get<Disciplina>(`${this.baseURL}/${id}`);
  }

  post(disciplina: Disciplina): Observable<Disciplina> {
    return this.http.post<Disciplina>(this.baseURL, disciplina);
  }

  put(disciplina: Disciplina): Observable<void> {
    return this.http.put<void>(`${this.baseURL}/${disciplina.id}`, disciplina);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`);
  }
}
