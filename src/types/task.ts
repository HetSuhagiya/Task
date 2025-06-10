export type TaskStatus = 'To Do' | 'Doing' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string; // ISO 8601 string
  startTime?: string; // Optional: when task started being 'Doing'
  endTime?: string; // Optional: when task was marked 'Done'
  priority?: TaskPriority;
}

export interface DailyStats {
  date: string; // ISO 8601 string for the day (e.g., 'YYYY-MM-DD')
  completedTasksCount: number;
  streak: number;
}

export default Task; 