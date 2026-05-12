import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule] // Required for the form
})
export class AddTaskModalComponent {
  title = '';
  description = '';
  priority: 'alta' | 'media' | 'baja' = 'media';

  constructor(private modalCtrl: ModalController) {
    addIcons({ close });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    if (!this.title.trim()) return;

    // Returns the data to the component that opened the modal
    this.modalCtrl.dismiss({
      title: this.title,
      description: this.description,
      priority: this.priority
    });
  }
}
