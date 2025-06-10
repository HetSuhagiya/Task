import { useState } from 'react';
import { Task } from '../types/task';
import { TaskCard } from './TaskCard';

interface CalendarViewProps {
  tasks: Task[];
  onStatusChange: (id: string, status: Task['status'], startTime?: string, endTime?: string) => void;
  onDelete: (id: string) => void;
  onPriorityChange: (id: string, priority: Task['priority']) => void;
}

export const CalendarView = ({ tasks, onStatusChange, onDelete, onPriorityChange }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getFormattedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const tasksForSelectedDate = getTasksForDate(selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => handleDateChange(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-gray-800">
          {getFormattedDate(selectedDate)}
        </h2>

        <button
          onClick={() => handleDateChange(1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {tasksForSelectedDate.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks for this date
          </div>
        ) : (
          tasksForSelectedDate.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onPriorityChange={onPriorityChange}
            />
          ))
        )}
      </div>
    </div>
  );
}; 