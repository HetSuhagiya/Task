import { useState } from 'react';
import { TaskPriority } from '../types/task';

interface TaskFormProps {
  onSubmit: (title: string, description: string, priority?: TaskPriority) => void;
  onClose: () => void;
}

export const TaskForm = ({ onSubmit, onClose }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [titleError, setTitleError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    onSubmit(title.trim(), description.trim(), priority);
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setTitleError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError('');
          }}
          className={`
            mt-1 block w-full rounded-md
            bg-white text-gray-800 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            sm:text-sm p-2.5
            ${titleError ? 'border-red-300' : ''}
          `}
          placeholder="Enter task title"
        />
        {titleError && (
          <p className="mt-1 text-sm text-red-600">{titleError}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md
            bg-white text-gray-800 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            sm:text-sm p-2.5 resize-none"
          placeholder="Enter task description (optional)"
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="mt-1 block w-full rounded-md
            bg-white text-gray-800 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            sm:text-sm p-2.5 appearance-none"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Task
        </button>
      </div>
    </form>
  );
}; 