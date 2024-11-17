import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from 'src/app/modal/task.model';
import { TaskServiceService } from 'src/app/services/task.service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent {
  task?: Task;

  constructor(
    private taskService: TaskServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTask(+id);
    }
  }

  loadTask(id: number): void {
    this.taskService.getTaskById(id).subscribe(task => {
      this.task = task;
    });
  }
  editTask(): void {
    if (this.task) {
      this.router.navigate(['/tasks', this.task.id, 'edit']);
    }
  }

  deleteTask(): void {


    Swal.fire({
      title: "Are you sure?",
      text: "You won't to Delete!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (this.task && result.isConfirmed) {
        this.taskService.deleteTask(this.task.id).subscribe(() => {
          this.router.navigate(['/tasks']);
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

}
