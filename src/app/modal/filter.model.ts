export interface TaskFilter {
    searchTerm: string;
    status: 'All' | 'Completed' | 'Pending';
    sortBy: 'title' | 'status' | 'createdAt';
    sortDirection: 'asc' | 'desc';
  }