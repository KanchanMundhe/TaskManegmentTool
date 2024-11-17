import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Task } from 'src/app/modal/task.model';
import { TaskServiceService } from 'src/app/services/task.service.service';
import Swal from 'sweetalert2';

import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FilterCriteria } from '../search-filter/search-filter.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filterForm: FormGroup;

  constructor(
    private taskService: TaskServiceService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      status: ['All'],
      sortBy: ['title'],
      sortOrder: ['asc']
    });
  }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.filteredTasks = tasks;
    });
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }
  
  applyFilters() {
    const formValues = this.filterForm.value;
    let filtered = [...this.tasks];

    // Apply search filter
    if (formValues.search) {
      const searchTerm = formValues.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (formValues.status !== 'All') {
      filtered = filtered.filter(task => task.status === formValues.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (formValues.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return formValues.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredTasks = filtered;
  }

  toggleSortOrder() {
    const currentOrder = this.filterForm.get('sortOrder')?.value;
    this.filterForm.patchValue({
      sortOrder: currentOrder === 'asc' ? 'desc' : 'asc'
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


  onFilterChange(criteria: FilterCriteria) {
    console.log('Filter criteria:', criteria);
    
    // Start with all tasks
    let filtered = [...this.tasks];

    // Apply search filter
    if (criteria.search) {
      const searchTerm = criteria.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (criteria.status && criteria.status !== 'All') {
      filtered = filtered.filter(task => task.status === criteria.status);
    }

    // Apply sorting
    if (criteria.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        
        switch (criteria.sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;
          case 'createdAt':
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            break;
        }

        return criteria.sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    this.filteredTasks = filtered;
    console.log('Filtered tasks:', this.filteredTasks);
  }


}