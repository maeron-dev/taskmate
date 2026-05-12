import { Component, OnInit } from '@angular/core';
// Añadimos los componentes necesarios: IonList, IonItem, IonLabel, IonBadge, CommonModule, IonProgressBar, ModalController
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonFab, IonFabButton, IonList, IonItem, IonLabel, IonBadge, IonProgressBar, ModalController } from '@ionic/angular/standalone';
import { CommonModule, DecimalPipe } from '@angular/common'; // ¡Importante para el *ngFor y DecimalPipe!
import { addIcons } from 'ionicons';
import { add, alertCircleOutline, arrowForwardOutline } from 'ionicons/icons';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { Router } from '@angular/router';
// Importamos tu modal reactivo
import { AddTaskModalComponent } from '../components/add-task-modal/add-task-modal.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule, DecimalPipe, // Necesario para usar directivas como *ngFor y filtros numéricos
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, 
    IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonButton, 
    IonIcon, IonFab, IonFabButton, IonList, IonItem, IonLabel, IonBadge,
    IonProgressBar // Inyectado para la barra de progreso
  ],
})
export class Tab1Page {
  tasks: Task[] = [];
  stats = { total: 0, completed: 0, pending: 0 };
  urgentTasks: Task[] = []; // <-- Variable añadida para el Reto Bonus

  constructor(
    private taskService: TaskService,
    private router: Router, // Inyectado para navegar a Tab 2
    private modalCtrl: ModalController // <-- Inyectado para poder abrir el modal desde Tab1
  ) {
    addIcons({ add, 'alert-circle-outline': alertCircleOutline, 'arrow-forward-outline': arrowForwardOutline });
  }

  ionViewWillEnter() {
    this.refreshData();
  }

  // Función para cargar los datos del servicio modificada sin borrar contenido previo
  refreshData() {
    this.tasks = this.taskService.getTasks();
    this.stats = this.taskService.getStats();
    
    // Lógica Reto Bonus: Tareas de prioridad alta pendientes limitadas a 3 elementos
    this.urgentTasks = this.tasks
      .filter(t => !t.completed && t.priority === 'alta')
      .slice(0, 3);
  }

  // Función añadida para abrir el modal desde esta pantalla principal
  async openAddModal() {
    const modal = await this.modalCtrl.create({
      component: AddTaskModalComponent
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.taskService.addTask({
        title: data.title,
        description: data.description,
        priority: data.priority,
        category: data.category || 'personal',
        dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
        completed: false
      });
      
      // Refrescamos al instante los datos de esta pantalla
      this.refreshData();
    }
  }

  // Navegación para el enlace de "Ver todas" del Reto Bonus
  goToTab2() {
    this.router.navigate(['/tabs/tab2']);
  }
}
