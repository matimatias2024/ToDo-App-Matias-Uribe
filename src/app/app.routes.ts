import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks-list',
    pathMatch: 'full',
  },
  {
    path: 'tasks-list',
    loadComponent: () => import('./pages/tasks-list/tasks-list.page').then( m => m.TasksListPage)
  },
  {
    path: 'task-form',
    loadComponent: () => import('./pages/task-form/task-form.page').then( m => m.TaskFormPage)
  },
  {
    path: 'task-form/:id',
    loadComponent: () => import('./pages/task-form/task-form.page').then( m => m.TaskFormPage)
  },
  {
    path: 'credits',
    loadComponent: () => import('./pages/credits/credits.page').then( m => m.CreditsPage)
  },
];
