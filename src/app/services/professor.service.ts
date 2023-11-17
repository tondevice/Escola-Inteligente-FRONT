import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Professor } from '../models/Professor';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  baseURL = `${environment.mainUrlAPI}professores`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Professor[]> {
    return this.http.get<Professor[]>(this.baseURL);
  }

  getById(id: number): Observable<Professor> {
    return this.http.get<Professor>(`${this.baseURL}/${id}`);
  }

  getByAlunoId(id: number): Observable<Professor[]> {
    return this.http.get<Professor[]>(`${this.baseURL}/ByAluno/${id}`);
  }

  post(professor: Professor) {
    return this.http.post(this.baseURL, professor, this.httpOptions);
  }

  put(professor: Professor) {
    return this.http.put(`${this.baseURL}/${professor.id}`, professor);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

}
