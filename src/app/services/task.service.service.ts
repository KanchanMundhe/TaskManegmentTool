import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, throwError } from 'rxjs';
import { Task } from '../modal/task.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {
  private tasks$ = new BehaviorSubject<Task[]>([]);
  private baseUrl = 'api/tasks'; // Simulated API URL

  constructor(private http: HttpClient) {
    this.loadInitialTasks();
  }

  private loadInitialTasks(): void {
    // Simulate initial data
    const initialTasks: Task[] = [
      {
        id: 1,
        title: 'Complete Project Documentation',
        description: 'Write comprehensive documentation for the project',
        status: 'Pending',
        createdAt: new Date()
      },
      {
        id: 2,
        title: 'Review Pull Requests',
        description: 'Review and merge pending pull requests',
        status: 'Completed',
        createdAt: new Date()
      }
    ];
    this.tasks$.next(initialTasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$.asObservable();
  }

  getTaskById(id: number): Observable<Task> {
    return this.tasks$.pipe(
      map(tasks => {
        const task = tasks.find(t => t.id === id);
        if (!task) {
          throw new Error('Task not found');
        }
        return task;
      })
    );
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): Observable<Task> {
    const newTask: Task = {
      ...task,
      id: this.generateId(),
      createdAt: new Date()
    };

    const currentTasks = this.tasks$.value;
    this.tasks$.next([...currentTasks, newTask]);
    return new Observable(observer => {
      observer.next(newTask);
      observer.complete();
    });
  }

  updateTask(id: number, updates: Partial<Task>): Observable<Task> {
    const currentTasks = this.tasks$.value;
    const updatedTasks = currentTasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    );
    this.tasks$.next(updatedTasks);
    return this.getTaskById(id);
  }

  deleteTask(id: number): Observable<void> {
    const currentTasks = this.tasks$.value;
    const updatedTasks = currentTasks.filter(task => task.id !== id);
    this.tasks$.next(updatedTasks);
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  private generateId(): number {
    const currentTasks = this.tasks$.value;
    return currentTasks.length > 0 
      ? Math.max(...currentTasks.map(t => t.id)) + 1 
      : 1;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}

