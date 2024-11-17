import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';


export interface FilterCriteria {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: string;
}
@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent {
  @Output() filterChange = new EventEmitter<FilterCriteria>();
  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: [''],
      status: ['All'],
      sortBy: ['title'],
      sortOrder: ['asc']
    });

    // Subscribe to form changes
    this.filterForm.valueChanges.subscribe(formValue => {
      console.log('Form changed:', formValue);
      this.filterChange.emit(formValue);
    });
  }

  toggleSortOrder(): void {
    const currentOrder = this.filterForm.get('sortOrder')?.value;
    this.filterForm.patchValue({
      sortOrder: currentOrder === 'asc' ? 'desc' : 'asc'
    });
  }
}