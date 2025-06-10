import { useState, useEffect } from 'react';
import { TaskPriority } from '../types/task';

interface TaskFormProps {
  initialTitle?: string;
  initialDescription?: string;
  onSubmit: (title: string, description: string, priority?: TaskPriority) => void;
  onClose: () => void;
  isEditMode?: boolean;
}

export const TaskForm = ({
  initialTitle = '',
  initialDescription = '',
  onSubmit,
  onClose,
  isEditMode = false,
}: TaskFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [priority, setPriority] = useState<TaskPriority>('Medium');

  useEffect(() => {
    if (initialTitle) setTitle(initialTitle);
    if (initialDescription) setDescription(initialDescription);
  }, [initialTitle, initialDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!title.trim()) {
      setTitleError(true);
      hasError = true;
    } else {
      setTitleError(false);
    }

    if (hasError) return;

    onSubmit(title, description, priority);
    onClose();
  };

  const inputClasses = `
    w-full
    bg-white
    border border-gray-300
    rounded-xl
    px-4 py-2.5
    text-gray-800
    placeholder-gray-400
    focus:outline-none
    focus:ring-2 focus:ring-blue-400
    focus:border-transparent
    transition-all
    duration-200
  `;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2">
      <div>
        <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          id="task-title"
          className={`${inputClasses} ${titleError ? 'border-red-400 focus:ring-red-400' : ''}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Read a book"
        />
        {titleError && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Title cannot be empty.
          </p>
        )}
      </div>
      <div>
        <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
        <textarea
          id="task-description"
          className={`${inputClasses} h-24 resize-none`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Finish chapter 5 of 'The Alchemist'"
        ></textarea>
      </div>

      <div>
        <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <div className="relative">
          <select
            id="task-priority"
            className={`${inputClasses} appearance-none pr-8 cursor-pointer`}
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <div className="
            pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700
          ">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={onClose}
          className="
            px-5 py-2.5
            rounded-xl
            text-gray-600
            bg-gray-100
            hover:bg-gray-200
            transition-colors
            duration-200
            font-medium
          "
        >
          Cancel
        </button>
        <button
          type="submit"
          className="
            px-5 py-2.5
            rounded-xl
            text-white
            bg-gradient-to-br from-blue-500 to-purple-600
            hover:from-blue-600 hover:to-purple-700
            transition-all
            duration-200
            shadow-lg shadow-blue-500/20
            font-medium
          "
        >
          {isEditMode ? 'Save Changes' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}; 