import { Component, OnInit } from '@angular/core';
// Añadimos los componentes necesarios: IonList, IonItem, IonLabel, IonBadge, CommonModule
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonFab, IonFabButton, IonList, IonItem, IonLabel, IonBadge } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common'; // ¡Importante para el *ngFor!
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule, // Necesario para usar directivas como *ngFor
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, 
    IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonButton, 
    IonIcon, IonFab, IonFabButton, IonList, IonItem, IonLabel, IonBadge
  ],
})
export class Tab1Page {
  tasks: Task[] = [];
  stats = { total: 0, completed: 0, pending: 0 };

  constructor(private taskService: TaskService) {
    addIcons({ add });
  }

  ionViewWillEnter() {
    this.refreshData();
  }

  // Función para cargar los datos del servicio
  refreshData() {
    this.tasks = this.taskService.getTasks();
    this.stats = this.taskService.getStats();
  }
}
