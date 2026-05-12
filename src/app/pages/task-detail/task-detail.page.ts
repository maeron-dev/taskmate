import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonBackButton, IonButton, IonIcon, IonBadge, IonNote, AlertController 
} from '@ionic/angular/standalone';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { addIcons } from 'ionicons';
import { trash, refresh, checkmark } from 'ionicons/icons';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonButtons, IonBackButton, IonButton, IonIcon, IonBadge, IonNote
  ]
})
export class TaskDetailPage implements OnInit {
  task: Task | undefined;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    addIcons({ trash, refresh, checkmark });
  }

  ngOnInit() {
    // Obtenemos el ID de la URL
    const id = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    if (id) {
      this.loadTask(id);
    }
  }

  // Carga asíncrona mediante suscripción al Observable de la API
  loadTask(id: number) {
    this.taskService.getTaskById(id).subscribe({
      next: (data: any) => {
        // Manejo seguro: si la API devuelve un array o un objeto estructurado con .data
        this.task = data.data ? data.data[0] : (Array.isArray(data) ? data[0] : data);
      },
      error: () => {
        this.router.navigate(['/tabs/tab2']);
      }
    });
  }

  toggleComplete() {
    if (this.task) {
      // Pasamos el ID y su estado booleano actual requerido por la nueva firma asíncrona del servicio
      this.taskService.toggleComplete(this.task.id, this.task.completed).subscribe({
        next: () => {
          // Volvemos a solicitar la información actualizada al servidor MySQL
          if (this.task) this.loadTask(this.task.id);
        }
      });
    }
  }

  async deleteTask() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar tarea',
      message: '¿Estás seguro? Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Eliminar', 
          role: 'destructive', 
          handler: () => {
            if (this.task) {
              // Eliminación física asíncrona en la base de datos MySQL
              this.taskService.deleteTask(this.task.id).subscribe({
                next: () => {
                  this.router.navigate(['/tabs/tab2']); // Volvemos a la lista al terminar
                }
              });
            }
          } 
        }
      ]
    });
    await alert.present();
  }
}
