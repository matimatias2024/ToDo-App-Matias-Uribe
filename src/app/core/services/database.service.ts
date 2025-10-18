import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;
  private isInitialized = false;

  constructor() {}

  async initDb(): Promise<void> {
    try {
      if (this.isInitialized) return;

      if (Capacitor.getPlatform() === 'web') {
        await this.initWebSQLite();
      }

      this.db = await this.sqlite.createConnection('todo.db', false, 'no-encryption', 1, false);
      await this.db.open();

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          category TEXT CHECK(category IN ('Trabajo','Estudios','Hogar','Otros')) DEFAULT 'Otros',
          priority TEXT CHECK(priority IN ('Baja','Media','Alta')) NOT NULL,
          status TEXT CHECK(status IN ('pendiente','completada')) DEFAULT 'pendiente',
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
      `;

      await this.db.execute(createTableQuery);
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing database:', error);
      throw new Error('No se pudo inicializar la base de datos');
    }
  }

  private async initWebSQLite(): Promise<void> {
    const jeepSqlite = document.createElement('jeep-sqlite');
    document.body.appendChild(jeepSqlite);
    await customElements.whenDefined('jeep-sqlite');
    await this.sqlite.initWebStore();
  }

  async getAll(): Promise<Task[]> {
    try {
      await this.ensureDbInitialized();
      const result = await this.db!.query('SELECT * FROM tasks ORDER BY created_at DESC');
      return result.values || [];
    } catch (error) {
      console.error('Error getting all tasks:', error);
      throw new Error('No se pudieron cargar las tareas');
    }
  }

  async getById(id: number): Promise<Task | null> {
    try {
      await this.ensureDbInitialized();
      const result = await this.db!.query('SELECT * FROM tasks WHERE id = ?', [id]);
      return result.values?.[0] || null;
    } catch (error) {
      console.error('Error getting task by id:', error);
      throw new Error('No se pudo cargar la tarea');
    }
  }

  async create(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    try {
      await this.ensureDbInitialized();
      const now = Date.now();
      const taskData = {
        ...task,
        category: task.category || 'Otros',
        status: task.status || 'pendiente',
        created_at: now,
        updated_at: now
      };

      const result = await this.db!.run(
        'INSERT INTO tasks (title, description, category, priority, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [taskData.title, taskData.description || '', taskData.category, taskData.priority, taskData.status, taskData.created_at, taskData.updated_at]
      );

      if (result.changes?.lastId) {
        const newTask = await this.getById(result.changes.lastId);
        if (newTask) return newTask;
      }

      throw new Error('No se pudo crear la tarea');
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('No se pudo crear la tarea');
    }
  }

  async update(task: Task): Promise<Task> {
    try {
      await this.ensureDbInitialized();
      const updatedTask = {
        ...task,
        updated_at: Date.now()
      };

      await this.db!.run(
        'UPDATE tasks SET title = ?, description = ?, category = ?, priority = ?, status = ?, updated_at = ? WHERE id = ?',
        [updatedTask.title, updatedTask.description || '', updatedTask.category, updatedTask.priority, updatedTask.status, updatedTask.updated_at, updatedTask.id]
      );

      const result = await this.getById(task.id!);
      if (result) return result;

      throw new Error('No se pudo actualizar la tarea');
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('No se pudo actualizar la tarea');
    }
  }

  async toggleStatus(id: number): Promise<Task> {
    try {
      await this.ensureDbInitialized();
      const task = await this.getById(id);
      if (!task) throw new Error('Tarea no encontrada');

      const newStatus: TaskStatus = task.status === 'pendiente' ? 'completada' : 'pendiente';
      const updatedTask = { ...task, status: newStatus };
      
      return await this.update(updatedTask);
    } catch (error) {
      console.error('Error toggling task status:', error);
      throw new Error('No se pudo cambiar el estado de la tarea');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.ensureDbInitialized();
      await this.db!.run('DELETE FROM tasks WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('No se pudo eliminar la tarea');
    }
  }

  async getByFilter(category?: TaskCategory | 'Todas', priority?: TaskPriority | 'Todas'): Promise<Task[]> {
    try {
      await this.ensureDbInitialized();
      let query = 'SELECT * FROM tasks WHERE 1=1';
      const params: any[] = [];

      if (category && category !== 'Todas') {
        query += ' AND category = ?';
        params.push(category);
      }

      if (priority && priority !== 'Todas') {
        query += ' AND priority = ?';
        params.push(priority);
      }

      query += ' ORDER BY created_at DESC';

      const result = await this.db!.query(query, params);
      return result.values || [];
    } catch (error) {
      console.error('Error filtering tasks:', error);
      throw new Error('No se pudieron filtrar las tareas');
    }
  }

  private async ensureDbInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initDb();
    }
  }
}