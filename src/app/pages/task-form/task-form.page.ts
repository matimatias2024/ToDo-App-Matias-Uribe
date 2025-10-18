import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonLabel,
  IonInput, IonTextarea, IonSelect, IonSelectOption, IonToast, IonSpinner,
  IonButtons, IonBackButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { save, close, arrowBack } from 'ionicons/icons';
import { DatabaseService } from '../../core/services/database.service';
import { Task, TaskCategory, TaskPriority, TASK_CATEGORIES, TASK_PRIORITIES, TaskValidator } from '../../core/models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.page.html',
  styleUrls: ['./task-form.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonLabel,
    IonInput, IonTextarea, IonSelect, IonSelectOption, IonToast, IonSpinner,
    IonButtons, IonBackButton, IonIcon,
    CommonModule, ReactiveFormsModule
  ]
})
export class TaskFormPage implements OnInit {
  taskForm: FormGroup;
  categories = TASK_CATEGORIES;
  priorities = TASK_PRIORITIES;
  isEditing = false;
  taskId: number | null = null;
  isLoading = false;
  isSaving = false;
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  constructor(
    private formBuilder: FormBuilder,
    private databaseService: DatabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ save, close, arrowBack });
    
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      category: ['Otros', [Validators.required]],
      priority: ['', [Validators.required]]
    });
  }

  async ngOnInit() {
    await this.initializeDatabase();
    this.checkEditMode();
  }

  async initializeDatabase() {
    try {
      await this.databaseService.initDb();
    } catch (error) {
      this.showToastMessage('Error al inicializar la base de datos', 'danger');
    }
  }

  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.taskId = parseInt(id, 10);
      this.loadTask();
    }
  }

  async loadTask() {
    if (!this.taskId) return;
    
    try {
      this.isLoading = true;
      const task = await this.databaseService.getById(this.taskId);
      
      if (task) {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description || '',
          category: task.category,
          priority: task.priority
        });
      } else {
        this.showToastMessage('Tarea no encontrada', 'danger');
        this.goBack();
      }
    } catch (error) {
      this.showToastMessage('Error al cargar la tarea', 'danger');
      this.goBack();
    } finally {
      this.isLoading = false;
    }
  }

  async saveTask() {
    if (this.taskForm.invalid) {
      this.markFormGroupTouched();
      this.showToastMessage('Por favor, completa todos los campos requeridos', 'warning');
      return;
    }

    const formValue = this.taskForm.value;
    const validationErrors = TaskValidator.validateTask(formValue);
    
    if (validationErrors.length > 0) {
      this.showToastMessage(validationErrors[0], 'warning');
      return;
    }

    try {
      this.isSaving = true;
      
      if (this.isEditing && this.taskId) {
        const existingTask = await this.databaseService.getById(this.taskId);
        if (existingTask) {
          const updatedTask: Task = {
            ...existingTask,
            title: formValue.title.trim(),
            description: formValue.description?.trim() || '',
            category: formValue.category,
            priority: formValue.priority
          };
          
          await this.databaseService.update(updatedTask);
          this.showToastMessage('Tarea actualizada correctamente', 'success');
        }
      } else {
        const newTask = {
          title: formValue.title.trim(),
          description: formValue.description?.trim() || '',
          category: formValue.category as TaskCategory,
          priority: formValue.priority as TaskPriority,
          status: 'pendiente' as const
        };
        
        await this.databaseService.create(newTask);
        this.showToastMessage('Tarea creada correctamente', 'success');
      }
      
      setTimeout(() => this.goBack(), 1500);
    } catch (error) {
      this.showToastMessage('Error al guardar la tarea', 'danger');
    } finally {
      this.isSaving = false;
    }
  }

  goBack() {
    this.router.navigate(['/tasks-list']);
  }

  getFieldError(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} es requerido`;
      }
      if (field.errors['maxlength']) {
        const maxLength = field.errors['maxlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} no puede exceder ${maxLength} caracteres`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      title: 'El título',
      description: 'La descripción',
      category: 'La categoría',
      priority: 'La prioridad'
    };
    return displayNames[fieldName] || fieldName;
  }

  private markFormGroupTouched() {
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      control?.markAsTouched();
    });
  }

  private showToastMessage(message: string, color: string = 'success') {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}
