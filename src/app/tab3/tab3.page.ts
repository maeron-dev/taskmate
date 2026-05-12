import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonAvatar, IonBadge, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonChip, IonLabel, IonList, IonItem, IonIcon, IonButton, AlertController } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { TaskService } from '../services/task.service';
import { addIcons } from 'ionicons';
import { school, calendar, clipboardOutline, trash } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonAvatar, IonBadge, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonChip, IonLabel, IonList, IonItem, IonIcon, IonButton],
})
export class Tab3Page {
  constructor(
    private taskService: TaskService,
    private alertCtrl: AlertController
  ) {
    addIcons({ school, calendar, 'clipboard-outline': clipboardOutline, trash });
  }

  // Gestiona el cuadro de diálogo de confirmación (Reto Bonus)
  async presentClearConfirmation() {
    const alert = await this.alertCtrl.create({
      header: '¿Borrar todo?',
      message: 'Esta acción eliminará de forma permanente todas las tareas de la aplicación.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sí, borrar',
          role: 'destructive',
          handler: () => {
            this.taskService.clearAllTasks();
          }
        }
      ]
    });

    await alert.present();
  }
}
