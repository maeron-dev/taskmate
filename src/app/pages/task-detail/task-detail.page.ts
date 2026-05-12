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
    this.task = this.taskService.getTaskById(id);
  }

  toggleComplete() {
    if (this.task) {
      this.taskService.toggleComplete(this.task.id);
      // Refrescamos la referencia para que la vista se actualice
      this.task = this.taskService.getTaskById(this.task.id);
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
              this.taskService.deleteTask(this.task.id);
              this.router.navigate(['/tabs/tab2']); // Volvemos a la lista
            }
          } 
        }
      ]
    });
    await alert.present();
  }
}
