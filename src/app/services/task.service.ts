import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { ApiService } from './api.service'; // <-- Importación requerida para conectar el backend
import { Observable } from 'rxjs'; // <-- Requerido para manejar los flujos asíncronos

@Injectable({ providedIn: 'root' }) // Hace que el servicio sea accesible en toda la app
export class TaskService {
  // Las tareas iniciales en memoria se eliminan ya que ahora la "base de datos" reside en MySQL

  private STORAGE_KEY = 'taskmate_tasks';

  constructor(private apiService: ApiService) {
    // La carga inicial automática de localStorage se reemplaza por el ciclo HTTP reactivo
  }

  // Devuelve un Observable con todas las tareas obtenidas de la API real
  getTasks(): Observable<Task[]> { 
    return this.apiService.getTasks(); 
  }

  // Busca una tarea específica por su ID a través de la API REST convirtiéndola en un Observable
  getTaskById(id: number): Observable<Task> {
    return this.apiService.updateTask(id, {}); 
  }

  // Crea una tarea nueva resolviendo la discrepancia de nombres de variables de fecha
  addTask(data: any): Observable<Task> {
    return this.apiService.createTask(data);
  }

  // Cambia entre completada y pendiente persistiendo el cambio en la base de datos MySQL
  toggleComplete(id: number, currentStatus: boolean): Observable<Task> {
    return this.apiService.updateTask(id, { completed: !currentStatus });
  }

  // Elimina una tarea de la lista permanentemente en el servidor MySQL
  deleteTask(id: number): Observable<any> {
    return this.apiService.deleteTask(id);
  }

  // Devuelve un resumen (total, completadas y pendientes) calculado directamente por SQL
  getStats(): Observable<any> {
    return this.apiService.getStats();
  }

  // Método del Reto Bonus: Sigue limpiando el almacenamiento local residual para mantener la app higienizada
  clearAllTasks(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('taskmate_nextId');
  }
}
