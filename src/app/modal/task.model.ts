export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'Completed' | 'Pending';
    createdAt: Date;
  }