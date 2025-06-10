import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { Modal } from './Modal';
import { Sidebar } from './Sidebar';
import { CalendarView } from './CalendarView';
import { CompletedView } from './CompletedView';
import { InsightsView } from './InsightsView';
import type { Task, TaskStatus, TaskPriority, DailyStats } from '../types/task';
import * as db from '../utils/db';

export const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPastTasks, setShowPastTasks] = useState(false);
  const [completedTasksToday, setCompletedTasksToday] = useState(0);
  const [streak, setStreak] = useState(0);
  const location = useLocation();

  // Helper function to get the start of the day (midnight) for a date
  const getStartOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Helper function to check if a date is today
  const isToday = (dateString: string) => {
    const taskDate = getStartOfDay(new Date(dateString));
    const today = getStartOfDay(new Date());
    return taskDate.getTime() === today.getTime();
  };

  // Helper function to get YYYY-MM-DD format
  const getFormattedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to check if a date is yesterday
  const isYesterday = (dateString: string) => {
    const taskDate = getStartOfDay(new Date(dateString));
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfYesterday = getStartOfDay(yesterday);
    return taskDate.getTime() === startOfYesterday.getTime();
  };

  // Load tasks and daily stats from IndexedDB on initial render
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('Attempting to load initial data...');
      try {
        const savedTasks = await db.getAllTasks();
        setTasks(savedTasks);
        console.log('Tasks loaded:', savedTasks);

        const todayFormatted = getFormattedDate(new Date());
        const yesterdayFormatted = getFormattedDate(new Date(new Date().setDate(new Date().getDate() - 1)));

        const todayStats = await db.getDailyStats(todayFormatted);
        const yesterdayStats = await db.getDailyStats(yesterdayFormatted);
        const latestStats = await db.getLatestDailyStats(); // Get latest for streak consistency

        // Initialize today's completed tasks count
        const initialCompletedToday = savedTasks.filter(task => isToday(task.createdAt) && task.status === 'Done').length;
        setCompletedTasksToday(initialCompletedToday);

        // Calculate and set streak
        if (latestStats && latestStats.date === yesterdayFormatted && latestStats.completedTasksCount > 0) {
          setStreak(latestStats.streak + 1);
        } else if (todayStats && todayStats.completedTasksCount > 0) {
          // If today has completions and yesterday didn't or doesn't exist, start streak from 1
          setStreak(1);
        } else {
          setStreak(0); // Reset streak if no tasks completed yesterday or today (unless streak was already 0)
        }

        setError(null);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load data. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
        console.log('Finished loading initial data. isLoading:', false);
      }
    };

    loadInitialData();
  }, []);

  // Effect to update daily stats on task changes
  useEffect(() => {
    const updateStats = async () => {
      const todayFormatted = getFormattedDate(new Date());
      const completedCount = tasks.filter(task => isToday(task.createdAt) && task.status === 'Done').length;
      setCompletedTasksToday(completedCount);

      let currentStreak = streak; // Use current streak from state

      const latestStats = await db.getLatestDailyStats();

      // Check if a new day has started and update streak accordingly
      if (latestStats && latestStats.date !== todayFormatted) {
        const latestDate = new Date(latestStats.date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - latestDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1 && latestStats.completedTasksCount > 0) {
          currentStreak = latestStats.streak + 1;
        } else {
          currentStreak = 0;
        }
        setStreak(currentStreak);
      }

      const dailyStats: DailyStats = {
        date: todayFormatted,
        completedTasksCount: completedCount,
        streak: currentStreak,
      };

      try {
        await db.updateDailyStats(dailyStats);
      } catch (err) {
        console.error('Error updating daily stats:', err);
        setError('Failed to save daily stats.');
      }
    };

    updateStats();
  }, [tasks]); // Rerun when tasks change

  const addTask = async (title: string, description: string, priority: TaskPriority) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: 'To Do',
      createdAt: new Date().toISOString(),
      priority,
    };

    try {
      await db.addTask(newTask);
      setTasks(prevTasks => [...prevTasks, newTask]);
      setError(null);
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task. Please try again.');
    }

    setIsModalOpen(false);
  };

  const handleStatusChange = async (id: string, newStatus: TaskStatus, startTime?: string, endTime?: string) => {
    const updatedTask = tasks.find(task => task.id === id);
    if (!updatedTask) return;

    const taskWithNewStatus = {
      ...updatedTask,
      status: newStatus,
      startTime,
      endTime,
    };

    try {
      await db.updateTask(taskWithNewStatus);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? taskWithNewStatus : task
        )
      );
      setError(null);
    } catch (err) {
      console.error('Error updating task status:', err);
      setError('Failed to update task status. Please try again.');
    }
  };

  const handlePriorityChange = async (id: string, newPriority: TaskPriority) => {
    const updatedTask = tasks.find(task => task.id === id);
    if (!updatedTask) return;

    const taskWithNewPriority = {
      ...updatedTask,
      priority: newPriority,
    };

    try {
      await db.updateTask(taskWithNewPriority);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? taskWithNewPriority : task
        )
      );
      setError(null);
    } catch (err) {
      console.error('Error updating task priority:', err);
      setError('Failed to update task priority. Please try again.');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await db.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  const renderContent = () => {
    console.log('Rendering content. isLoading:', isLoading, 'error:', error, 'tasks count:', tasks.length);

    if (isLoading) {
      console.log('Displaying loading spinner.');
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      console.log('Displaying error message.');
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-center">
            <p className="font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-blue-500 hover:text-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    const tasksToDisplay = tasks.filter(task => {
      if (showPastTasks) {
        return isToday(task.createdAt) || isYesterday(task.createdAt);
      }
      return isToday(task.createdAt);
    });
    console.log('Tasks to display count:', tasksToDisplay.length, 'Tasks to display:', tasksToDisplay);

    const totalTasksToday = tasks.filter(task => isToday(task.createdAt)).length;

    switch (location.pathname) {
      case '/calendar':
        return <CalendarView tasks={tasks} onStatusChange={handleStatusChange} onDelete={deleteTask} onPriorityChange={handlePriorityChange}/>;
      case '/completed':
        return <CompletedView tasks={tasks} onDelete={deleteTask} />;
      case '/insights':
        return <InsightsView tasks={tasks} />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(['To Do', 'Doing', 'Done'] as TaskStatus[]).map((status) => (
              <div 
                key={status} 
                className="
                  glass
                  rounded-2xl
                  shadow-xl
                  p-6
                  transition-all
                  duration-300
                  ease-in-out
                  hover:shadow-2xl
                  hover:-translate-y-1
                "
              >
                <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b border-gray-200 pb-3 tracking-tight">
                  {status} ({tasksToDisplay.filter(task => task.status === status).length})
                </h2>
                <div className="space-y-4">
                  {tasksToDisplay
                    .filter(task => task.status === status)
                    .map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onDelete={deleteTask}
                        onPriorityChange={handlePriorityChange}
                      />
                    ))}
                  {tasksToDisplay.filter(task => task.status === status).length === 0 && (
                    <p className="text-gray-400 text-center py-8 italic">
                      No tasks yet
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <div className="p-6">
            <div className="flex justify-between items-center mb-12">
              <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">
                Task Manager
              </h1>
              <div className="flex items-center gap-4">
                {location.pathname === '/' && (
                  <div className="glass rounded-full px-5 py-2 flex items-center gap-4 text-gray-700 text-sm font-medium shadow-md">
                    <span>✅ Tasks Done Today: {completedTasksToday} / {tasks.filter(t => isToday(t.createdAt)).length}</span>
                    <span>🔥 Streak: {streak} Days Active</span>
                  </div>
                )}

                {location.pathname === '/' && (
                  <button
                    onClick={() => setShowPastTasks(!showPastTasks)}
                    className="
                      inline-flex items-center
                      px-5 py-2.5
                      rounded-md
                      text-[15px] font-medium
                      text-gray-700
                      bg-gray-100
                      border border-gray-300
                      hover:bg-gray-200
                      transition-all
                      duration-300
                      ease-in-out
                      hover:shadow-sm
                      hover:scale-[1.01]
                      focus:outline-none
                      focus:ring-2 focus:ring-gray-300
                    "
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {showPastTasks ? "Hide Yesterday's Tasks" : "Show Yesterday's Tasks"}
                  </button>
                )}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="
                    inline-flex items-center
                    px-5 py-2.5
                    rounded-lg
                    bg-gradient-to-r from-blue-500 to-indigo-500
                    text-white text-[15px] font-medium
                    shadow-lg
                    hover:shadow-md
                    hover:scale-[1.01]
                    transform
                    transition-all
                    duration-300
                    ease-in-out
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add New Task
                </button>
              </div>
            </div>

            {renderContent()}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Task">
              <TaskForm onSubmit={addTask} onClose={() => setIsModalOpen(false)} />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}; 