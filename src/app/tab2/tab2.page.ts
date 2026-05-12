import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Añadido para los filtros
// Se añaden IonRefresher e IonRefresherContent a los componentesStandalone
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonList, IonItem, IonLabel, IonSearchbar, IonSegment, IonSegmentButton, IonBadge, IonCheckbox, IonFab, IonFabButton, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { addIcons } from 'ionicons';
import { clipboardOutline, add } from 'ionicons/icons';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular/standalone';
import { AddTaskModalComponent } from '../components/add-task-modal/add-task-modal.component';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, 
    IonList, IonItem, IonLabel, IonSearchbar, IonSegment, 
    IonSegmentButton, IonBadge, IonCheckbox, IonFab, IonFabButton,
    IonRefresher, IonRefresherContent // <-- Registrados para habilitar el refresco por arrastre
  ]
})
export class Tab2Page {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedFilter = 'all';

  constructor(
    private taskService: TaskService, 
    private router: Router,
    private modalCtrl: ModalController, // Añadir esto
    private toastCtrl: ToastController   // Añadir esto
  ) {
    addIcons({ 'clipboard-outline': clipboardOutline, add });
  }

    // 2. Añade la función para abrir el modal
  async openAddModal() {
    const modal = await this.modalCtrl.create({
      component: AddTaskModalComponent
    });

    await modal.present();

    // Esperamos a que el modal se cierre
    const { data } = await modal.onWillDismiss();

    // Si el usuario guardó datos (no cerró sin más)
    if (data) {
      this.taskService.addTask({
        title: data.title,
        description: data.description,
        priority: data.priority,
        category: data.category || 'personal',
        dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
        completed: false // <-- Agrega esta línea para satisfacer a TypeScript
      });

      // Refrescamos la lista
      this.tasks = this.taskService.getTasks();
      this.applyFilter();



      // Mostramos el mensaje de éxito (Toast)
      const toast = await this.toastCtrl.create({
        message: '✅ Tarea creada correctamente',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
    }
  }

  // Se ejecuta cada vez que entras a la pestaña para ver los cambios
  ionViewWillEnter() {
    this.tasks = this.taskService.getTasks();
    this.applyFilter();
  }

  // Ejecuta la actualización manual al arrastrar la interfaz hacia abajo
  doRefresh(event: any) {
    this.tasks = this.taskService.getTasks();
    this.applyFilter();
    event.target.complete(); // <-- Notifica fin de la operación ocultando el spinner animado
  }

  filterTasks(event: any) {
    const query = event.target.value?.toLowerCase() || '';
    this.filteredTasks = this.tasks.filter(t => t.title.toLowerCase().includes(query));
  }

  applyFilter() {
    if (this.selectedFilter === 'pending') this.filteredTasks = this.tasks.filter(t => !t.completed);
    else if (this.selectedFilter === 'done') this.filteredTasks = this.tasks.filter(t => t.completed);
    else this.filteredTasks = [...this.tasks];
  }

  onToggle(task: Task) {
    this.taskService.toggleComplete(task.id);
    this.tasks = this.taskService.getTasks();
    this.applyFilter(); 
  }

  goToDetail(id: number) {
    this.router.navigate(['/task-detail', id]);
  }
}
