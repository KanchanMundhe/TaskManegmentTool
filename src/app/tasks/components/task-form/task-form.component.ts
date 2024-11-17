import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskServiceService } from 'src/app/services/task.service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {

  taskForm: FormGroup;
  isEditMode = false;
  taskId?: number;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: ['Pending']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.taskId = +id;
      this.loadTask(this.taskId);
    }
  }

  loadTask(id: number): void {
    this.taskService.getTaskById(id).subscribe(task => {
      this.taskForm.patchValue({
        title: task.title,
        description: task.description,
        status: task.status
      });
    });
  }

  onSubmit(): void {
    debugger
    if (this.taskForm.valid) {
      if (this.isEditMode && this.taskId) {
        this.taskService.updateTask(this.taskId, this.taskForm.value)
          .subscribe(() => this.router.navigate(['/tasks']));
          Swal.fire({
            text: "Task Updated Sucessfully.. !",
            icon: "success"
          });
      } else {
        this.taskService.addTask(this.taskForm.value)
          .subscribe(() => this.router.navigate(['/tasks']));
          Swal.fire({
            text: "Task Created!",
            icon: "success"
          });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }

  showError(field: string): boolean {
    const control = this.taskForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
}
