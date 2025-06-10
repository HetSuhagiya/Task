import { Task } from '../types/task';
import { TaskCard } from './TaskCard';

interface CompletedViewProps {
  tasks: Task[];
  onDelete: (id: string) => void;
}

export const CompletedView = ({ tasks, onDelete }: CompletedViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Completed Tasks</h2>
        <span className="text-sm text-gray-500">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No completed tasks yet
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={() => {}} // No-op since tasks are already completed
              onDelete={onDelete}
              onPriorityChange={() => {}} // No-op since priority doesn't matter for completed tasks
            />
          ))
        )}
      </div>
    </div>
  );
}; 