import { useState } from 'react';
import type { Task } from '../types/task';

interface CompletedViewProps {
  tasks: Task[];
  onClearCompleted: () => void;
}

export const CompletedView = ({ tasks, onClearCompleted }: CompletedViewProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const completedTasks = tasks.filter(task => task.status === 'Done');

  const handleClearAll = () => {
    if (showConfirm) {
      onClearCompleted();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Clear All button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Completed Tasks
        </h2>
        {completedTasks.length > 0 && (
          <button
            onClick={handleClearAll}
            className={`
              px-4 py-2 rounded-lg
              transition-all duration-200
              ${showConfirm
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {showConfirm ? 'Click again to confirm' : 'Clear All'}
          </button>
        )}
      </div>

      {/* Completed Tasks List */}
      <div className="space-y-4">
        {completedTasks.length > 0 ? (
          completedTasks.map((task) => (
            <div
              key={task.id}
              className="
                glass
                rounded-xl
                p-4
                flex items-start gap-3
                transition-all
                duration-200
                hover:shadow-lg
              "
            >
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-gray-800 line-through text-gray-500">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {task.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            No completed tasks yet
          </div>
        )}
      </div>
    </div>
  );
}; 