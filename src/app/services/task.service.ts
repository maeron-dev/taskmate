import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' }) // Hace que el servicio sea accesible en toda la app
export class TaskService {
  // Nuestra "base de datos" temporal en memoria
  private tasks: Task[] = [
    { id: 1, title: 'Aprender Ionic', description: 'Completar el Sprint 2', priority: 'alta', completed: false, createdAt: new Date() },
    { id: 2, title: 'Hacer ejercicio', description: '30 minutos de cardio', priority: 'media', completed: true, createdAt: new Date() },
    { id: 3, title: 'Leer libro', description: 'Clean Code - capítulo 3', priority: 'baja', completed: false, createdAt: new Date() },
  ];

  private nextId = 4; // Contador para asignar IDs nuevos

  // Devuelve una copia de todas las tareas
  getTasks(): Task[] { return [...this.tasks]; }

  // Busca una tarea específica por su ID
  getTaskById(id: number): Task | undefined {
    return this.tasks.find(t => t.id === id);
  }

  // Crea una tarea nueva y la añade al array
  addTask(data: Omit<Task, 'id' | 'createdAt'>): Task {
    const task: Task = { ...data, id: this.nextId++, createdAt: new Date() };
    this.tasks.push(task);
    return task;
  }

  // Cambia entre completada y pendiente
  toggleComplete(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
  }

  // Elimina una tarea de la lista
  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }

  // Devuelve un resumen (total, completadas y pendientes)
  getStats() {
    return {
      total: this.tasks.length,
      completed: this.tasks.filter(t => t.completed).length,
      pending: this.tasks.filter(t => !t.completed).length,
    };
  }
}
