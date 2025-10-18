import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonSegment, IonSegmentButton, 
  IonLabel, IonList, IonItem, IonBadge, IonIcon, IonButton, IonFab, IonFabButton,
  IonCheckbox, IonItemSliding, IonItemOptions, IonItemOption, IonSelect, IonSelectOption,
  IonToast, IonAlert, IonSpinner, IonRefresher, IonRefresherContent, IonMenuButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, create, trash, checkmark, ellipsisVertical, funnel, person } from 'ionicons/icons';
import { DatabaseService } from '../../core/services/database.service';
import { Task, TaskCategory, TaskPriority, TASK_CATEGORIES, TASK_PRIORITIES } from '../../core/models/task.model';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.page.html',
  styleUrls: ['./tasks-list.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonSegment, IonSegmentButton,
    IonLabel, IonList, IonItem, IonBadge, IonIcon, IonButton, IonFab, IonFabButton,
    IonCheckbox, IonItemSliding, IonItemOptions, IonItemOption, IonSelect, IonSelectOption,
    IonToast, IonAlert, IonSpinner, IonRefresher, IonRefresherContent, IonMenuButton,
    CommonModule, FormsModule
  ]
})
export class TasksListPage implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedCategory: TaskCategory | 'Todas' = 'Todas';
  selectedPriority: TaskPriority | 'Todas' = 'Todas';
  categories = ['Todas', ...TASK_CATEGORIES];
  priorities = ['Todas', ...TASK_PRIORITIES];
  isLoading = false;
  showToast = false;
  toastMessage = '';
  showAlert = false;
  alertMessage = '';
  taskToDelete: number | null = null;
  alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => this.cancelDelete()
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      handler: () => this.deleteTask()
    }
  ];

  constructor(
    private databaseService: DatabaseService,
    private router: Router
  ) {
    addIcons({ add, create, trash, checkmark, ellipsisVertical, funnel, person });
  }

  async ngOnInit() {
    await this.initializeDatabase();
    await this.loadTasks();
  }

  async initializeDatabase() {
    try {
      await this.databaseService.initDb();
    } catch (error) {
      this.showToastMessage('Error al inicializar la base de datos');
    }
  }

  async loadTasks() {
    try {
      this.isLoading = true;
      this.tasks = await this.databaseService.getAll();
      this.applyFilters();
    } catch (error) {
      this.showToastMessage('Error al cargar las tareas');
    } finally {
      this.isLoading = false;
    }
  }

  applyFilters() {
    this.filteredTasks = this.tasks.filter(task => {
      const categoryMatch = this.selectedCategory === 'Todas' || task.category === this.selectedCategory;
      const priorityMatch = this.selectedPriority === 'Todas' || task.priority === this.selectedPriority;
      return categoryMatch && priorityMatch;
    });
  }

  onCategoryChange() {
    this.applyFilters();
  }

  onPriorityChange() {
    this.applyFilters();
  }

  async toggleTaskStatus(task: Task) {
    try {
      await this.databaseService.toggleStatus(task.id!);
      await this.loadTasks();
      this.showToastMessage(`Tarea marcada como ${task.status === 'pendiente' ? 'completada' : 'pendiente'}`);
    } catch (error) {
      this.showToastMessage('Error al cambiar el estado de la tarea');
    }
  }

  createTask() {
    this.router.navigate(['/task-form']);
  }

  editTask(task: Task) {
    this.router.navigate(['/task-form', task.id]);
  }

  confirmDelete(task: Task) {
    this.taskToDelete = task.id!;
    this.alertMessage = `¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`;
    this.showAlert = true;
  }

  async deleteTask() {
    if (this.taskToDelete) {
      try {
        await this.databaseService.delete(this.taskToDelete);
        await this.loadTasks();
        this.showToastMessage('Tarea eliminada correctamente');
      } catch (error) {
        this.showToastMessage('Error al eliminar la tarea');
      }
      this.taskToDelete = null;
    }
    this.showAlert = false;
  }

  cancelDelete() {
    this.taskToDelete = null;
    this.showAlert = false;
  }

  async doRefresh(event: any) {
    await this.loadTasks();
    event.target.complete();
  }

  goToCredits() {
    this.router.navigate(['/credits']);
  }

  getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
      case 'Alta': return 'danger';
      case 'Media': return 'warning';
      case 'Baja': return 'success';
      default: return 'medium';
    }
  }

  getCategoryColor(category: TaskCategory): string {
    switch (category) {
      case 'Trabajo': return 'primary';
      case 'Estudios': return 'secondary';
      case 'Hogar': return 'tertiary';
      case 'Otros': return 'medium';
      default: return 'medium';
    }
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id || index;
  }

  private showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }
}
