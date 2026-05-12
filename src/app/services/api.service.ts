import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Extraemos la propiedad .data de la respuesta del backend usando RxJS
  getTasks(): Observable<Task[]> {
    return this.http.get<{ success: boolean, data: Task[] }>(`${this.apiUrl}/tasks`).pipe(
      map(res => res.data)
    );
  }

  createTask(task: Omit<Task, 'id' | 'created_at' | 'completed'>): Observable<Task> {
    return this.http.post<{ success: boolean, data: Task }>(`${this.apiUrl}/tasks`, task).pipe(
      map(res => res.data)
    );
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<{ success: boolean, data: Task }>(`${this.apiUrl}/tasks/${id}`, task).pipe(
      map(res => res.data)
    );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${id}`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tasks/stats`);
  }
}
