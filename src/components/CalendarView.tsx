import { useState, useEffect } from 'react';
import type { Task } from '../types/task';

interface CalendarViewProps {
  tasks: Task[];
}

export const CalendarView = ({ tasks }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isMidnight, setIsMidnight] = useState(false);

  // Generate dates for the last 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date;
  });

  // Check for midnight
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setIsMidnight(true);
        // Reset after 1 minute
        setTimeout(() => setIsMidnight(false), 60000);
      }
    };

    const interval = setInterval(checkMidnight, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Format date for display
  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Filter tasks for selected date
  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    return taskDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <div className="space-y-6">
      {/* Midnight Prompt */}
      {isMidnight && (
        <div className="
          bg-blue-50
          border border-blue-200
          rounded-xl
          p-4
          mb-6
          animate-fade-in
        ">
          <p className="text-blue-600 text-sm">
            A new day has begun! Would you like to archive yesterday's tasks?
          </p>
        </div>
      )}

      {/* Date Selector */}
      <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
        {dates.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => setSelectedDate(date)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg
              transition-all duration-200
              ${selectedDate.toDateString() === date.toDateString()
                ? 'bg-blue-100 text-blue-600'
                : 'bg-white hover:bg-gray-50 text-gray-600'
              }
            `}
          >
            {formatDate(date)}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">
          Tasks for {formatDate(selectedDate)}
        </h2>
        <span className="text-sm text-gray-500">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
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
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                <div className="mt-2">
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${task.status === 'Done' ? 'bg-green-100 text-green-800' :
                      task.status === 'Doing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'}
                  `}>
                    {task.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="
            text-center py-12
            text-gray-500
            bg-white/50
            rounded-xl
            animate-fade-in
          ">
            {selectedDate.toDateString() === new Date().toDateString()
              ? "You haven't added any tasks today."
              : `No tasks for ${formatDate(selectedDate)}`
            }
          </div>
        )}
      </div>
    </div>
  );
}; 