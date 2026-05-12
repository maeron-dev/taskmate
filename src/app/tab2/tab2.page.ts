import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Añadido para los filtros
// Se añaden IonRefresher, IonRefresherContent e IonSpinner a los componentesStandalone
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonList, IonItem, IonLabel, IonSearchbar, IonSegment, IonSegmentButton, IonBadge, IonCheckbox, IonFab, IonFabButton, IonRefresher, IonRefresherContent, IonSpinner } from '@ionic/angular/standalone';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { addIcons } from 'ionicons';
import { clipboardOutline, add, cloudOfflineOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular/standalone';
import { AddTaskModalComponent } from '../components/add-task-modal/add-task-modal.component';
import { CommonModule } from '@angular/common'; // Requerido para usar *ngIf en Standalone

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    FormsModule, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, 
    IonList, IonItem, IonLabel, IonSearchbar, IonSegment, 
    IonSegmentButton, IonBadge, IonCheckbox, IonFab, IonFabButton,
    IonRefresher, IonRefresherContent, IonSpinner // <-- Registrado IonSpinner
  ]
})
export class Tab2Page {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedFilter = 'all';

  // Variables requeridas por los criterios de aceptación de T04
  isLoading = false;
  errorMessage = '';

  constructor(
    private taskService: TaskService, 
    private router: Router,
    private modalCtrl: ModalController, // Añadir esto
    private toastCtrl: ToastController   // Añadir esto
  ) {
    addIcons({ 'clipboard-outline': clipboardOutline, add, 'cloud-offline-outline': cloudOfflineOutline });
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
      this.isLoading = true;
      this.taskService.addTask({
        title: data.title,
        description: data.description,
        priority: data.priority,
        category: data.category || 'personal',
        dueDate: data.dueDate ? new Date(data.dueDate) : new Date()
      }).subscribe({
        next: () => {
          this.loadTasksBackend();
          this.showToast('✅ Tarea creada correctamente');
        },
        error: () => {
          this.isLoading = false;
          this.showToast('❌ Error al guardar en el servidor');
        }
      });
    }
  }

  // Se ejecuta cada vez que entras a la pestaña para ver los cambios
  ionViewWillEnter() {
    this.loadTasksBackend();
  }

  // Carga asíncrona centralizada conectada al backend real
  loadTasksBackend() {
    this.isLoading = true;
    this.errorMessage = '';
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'No se pudo conectar con la API. Comprueba el servidor.';
      }
    });
  }

  // Ejecuta la actualización manual al arrastrar la interfaz hacia abajo
  doRefresh(event: any) {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.applyFilter();
        event.target.complete(); // <-- Notifica fin de la operación ocultando el spinner animado
      },
      error: () => {
        event.target.complete();
      }
    });
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
    this.taskService.toggleComplete(task.id, task.completed).subscribe({
      next: () => {
        this.loadTasksBackend();
      }
    });
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      color: msg.startsWith('✅') ? 'success' : 'danger'
    });
    await toast.present();
  }

  goToDetail(id: number) {
    this.router.navigate(['/task-detail', id]);
  }
}
