export interface Task {
  id: number;                // Identificador único
  title: string;             // Título de la tarea
  description?: string;      // Descripción (opcional, por eso el '?')
  priority: 'alta' | 'media' | 'baja'; // Solo permite estos 3 valores
  completed: boolean;        // ¿Está terminada? true/false
  createdAt: Date;           // Fecha de creación
  category?: string;         // Categoría (opcional)
  dueDate: Date | string;
}
