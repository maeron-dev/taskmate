import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' }) // Hace que el servicio sea accesible en toda la app
export class TaskService {
   // Datos iniciales de prueba mantenidos por consistencia
  private tasks: Task[] = [
    { id: 1, title: 'Aprender Ionic', description: 'Completar el Sprint 2', priority: 'alta', category: 'personal', dueDate: new Date(), completed: false, createdAt: new Date() },
    { id: 2, title: 'Hacer ejercicio', description: '30 minutos de cardio', priority: 'media', category: 'personal', dueDate: new Date(), completed: true, createdAt: new Date() },
    { id: 3, title: 'Leer libro', description: 'Clean Code - capítulo 3', priority: 'baja', category: 'personal', dueDate: new Date(), completed: false, createdAt: new Date() },
  ];


  private nextId = 4; // Contador para asignar IDs nuevos
  private STORAGE_KEY = 'taskmate_tasks';

  constructor() {
    this.loadFromStorage();
  }

  // Guarda el estado actual en el almacenamiento local
  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
    localStorage.setItem('taskmate_nextId', String(this.nextId));
  }

  // Carga los datos guardados convirtiendo de nuevo las cadenas de texto en fechas válidas
  private loadFromStorage(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const savedId = localStorage.getItem('taskmate_nextId');
    if (saved) {
      this.tasks = JSON.parse(saved).map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        dueDate: t.dueDate ? new Date(t.dueDate) : '' // Conversión segura para el reto bonus anterior
      }));
    }
    if (savedId) this.nextId = parseInt(savedId);
  }

  // Devuelve una copia de todas las tareas
  getTasks(): Task[] { return [...this.tasks]; }

  // Busca una tarea específica por su ID
  getTaskById(id: number): Task | undefined {
    return this.tasks.find(t => t.id === id);
  }

  // Crea una tarea nueva y la añade al array persistiendo el cambio
  addTask(data: Omit<Task, 'id' | 'createdAt'>): Task {
    const task: Task = { ...data, id: this.nextId++, createdAt: new Date() };
    this.tasks.push(task);
    this.saveToStorage(); // <-- Guardar en local storage
    return task;
  }

  // Cambia entre completada y pendiente persistiendo el cambio
  toggleComplete(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveToStorage(); // <-- Guardar en local storage
    }
  }

  // Elimina una tarea de la lista persistiendo el cambio
  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveToStorage(); // <-- Guardar en local storage
  }

  // Devuelve un resumen (total, completadas y pendientes)
  getStats() {
    return {
      total: this.tasks.length,
      completed: this.tasks.filter(t => t.completed).length,
      pending: this.tasks.filter(t => !t.completed).length,
    };
  }

  // Método del Reto Bonus: Elimina absolutamente todo de la memoria y el almacenamiento local
  clearAllTasks(): void {
    this.tasks = [];
    this.nextId = 1;
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('taskmate_nextId');
  }
}
