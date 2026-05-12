import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

// Validador personalizado para el reto bonus
export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(control.value);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate >= today ? null : { minDate: true };
  };
}

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule] // Se añade ReactiveFormsModule
})
export class AddTaskModalComponent implements OnInit {
  taskForm!: FormGroup;
  minSelectableDate: string = new Date().toISOString();

  // Propiedades mantenidas por compatibilidad con tus ejercicios anteriores
  title = '';
  description = '';
  priority: 'alta' | 'media' | 'baja' = 'media';

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController
  ) {
    addIcons({ close });
  }

  ngOnInit() {
    // Inicialización del Formulario Reactivo
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      priority: ['media', Validators.required],
      category: ['personal'],
      dueDate: ['', [Validators.required, futureDateValidator()]] // Campo del reto bonus
    });
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.taskForm.get(field);
    // Retorna verdadero únicamente si el campo es inválido tras ser manipulado o enfocado
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }


  get titleError(): string {
    const ctrl = this.taskForm.get('title');
    if (ctrl?.hasError('required')) return 'El título es obligatorio';
    if (ctrl?.hasError('minlength')) return 'Mínimo 3 caracteres';
    if (ctrl?.hasError('maxlength')) return 'Máximo 100 caracteres';
    return '';
  }

  get dateError(): string {
    const ctrl = this.taskForm.get('dueDate');
    if (ctrl?.hasError('required')) return 'La fecha límite es obligatoria';
    if (ctrl?.hasError('minDate')) return 'La fecha no puede ser anterior a hoy';
    return '';
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    // Mapeo de valores para mantener consistencia con variables previas
    this.title = this.taskForm.value.title;
    this.description = this.taskForm.value.description;
    this.priority = this.taskForm.value.priority;

    // Retorna los datos con la misma estructura requerida por tu app
    this.modalCtrl.dismiss({
      title: this.title,
      description: this.description,
      priority: this.priority,
      category: this.taskForm.value.category,
      dueDate: this.taskForm.value.dueDate
    });
  }
}
