import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from 'src/app/modal/task.model';
import { TaskServiceService } from 'src/app/services/task.service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  tasks: Task[] = [];

  constructor(
    private taskService: TaskServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  navigateToAdd(): void {
    this.router.navigate(['/tasks/add']);
  }

  viewTask(id: number): void {
    this.router.navigate(['/tasks', id]);
  }

  editTask(id: number): void {
    this.router.navigate(['/tasks', id, 'edit']);
  }

  deleteTask(id: number): void {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't to Delete!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(id).subscribe(() => {
          this.tasks = this.tasks.filter(task => task.id !== id);
        });
      }
    });
  }
}
