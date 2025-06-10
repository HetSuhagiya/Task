import { useState } from 'react';
import type { Task, TaskStatus, TaskPriority } from '../types/task';
import { triggerConfetti } from '../utils/confetti';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus, startTime?: string, endTime?: string) => void;
  onDelete: (id: string) => void;
  onPriorityChange: (id: string, priority: TaskPriority) => void;
}

const EMOJIS = ['📌', '🚀', '✅', '⏳', '✨', '💡', '🎯', '🌟', '📝', '🎨'];
const MOTIVATIONAL_MESSAGES = [
  "Small steps make big change.",
  "Let's knock these out 🚀",
  "Keep crushing it!",
  "You're doing great!",
  "One task at a time 💪",
  "Making progress!",
  "Stay focused, stay awesome!",
  "You've got this! 🎯"
];

const statusColors = {
  'To Do': { bg: 'bg-blue-100', text: 'text-blue-800' },
  'Doing': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'Done': { bg: 'bg-green-100', text: 'text-green-800' },
};

const statusEmojis = {
  'To Do': '📋',
  'Doing': '⚡',
  'Done': '🎉',
};

const priorityConfig = {
  'Low': { icon: '', color: 'text-gray-700', bg: 'bg-gray-300' },
  'Medium': { icon: '', color: 'text-orange-700', bg: 'bg-orange-400' },
  'High': { icon: '', color: 'text-red-700', bg: 'bg-red-500' },
};

export const TaskCard = ({ task, onStatusChange, onDelete, onPriorityChange }: TaskCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [emoji, setEmoji] = useState(() => EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(task.id), 300);
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    const now = new Date().toISOString();
    let startTime = task.startTime;
    let endTime = task.endTime;

    if (newStatus === 'Doing' && task.status !== 'Doing') {
      startTime = now;
    } else if (newStatus === 'Done' && task.status !== 'Done') {
      endTime = now;
      triggerConfetti();
    }

    onStatusChange(task.id, newStatus, startTime, endTime);
  };

  const handlePriorityChange = (newPriority: TaskPriority) => {
    onPriorityChange(task.id, newPriority);
    setShowPriorityDropdown(false);
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const timeString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (isToday) {
      return timeString;
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }) + ' at ' + timeString;
  };

  const getPlaceholderText = () => {
    if (!task.description) {
      const placeholders = [
        "Waiting for genius ideas...",
        "You got this 💪",
        "Another one for the win 🧠",
        "Time to shine! ✨",
        "Let's make it happen! 🚀"
      ];
      return placeholders[Math.floor(Math.random() * placeholders.length)];
    }
    return task.description;
  };

  const currentPriority = task.priority || 'Medium';

  return (
    <div
      className={`
        glass
        rounded-xl
        p-4
        relative
        transition-all
        duration-300
        ease-in-out
        hover:scale-105
        hover:shadow-xl
        hover:ring-1
        hover:ring-blue-200
        ${isDeleting ? 'animate-task-out' : 'animate-task'}
      `}
    >
      {/* Status Ribbon */}
      <div className={`
        absolute top-0 left-0
        ${statusColors[task.status].bg}
        ${statusColors[task.status].text}
        px-3 py-1
        rounded-tr-xl
        text-xs
        font-medium
        flex items-center gap-1
      `}>
        {statusEmojis[task.status]} {task.status}
      </div>

      {/* Top-right controls container */}
      <div className="
        absolute top-2 right-2
        flex flex-col items-end gap-1
        sm:top-2 sm:right-2
      ">
        {/* Timestamp */}
        <div className="
          text-[10px] sm:text-xs
          text-gray-400
          animate-fade-in
          transition-all
          duration-300
          translate-y-0
          opacity-100
        ">
          {formatTimestamp(task.createdAt)}
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="
            p-1
            rounded-md
            bg-black/5
            text-gray-400
            hover:bg-red-50
            hover:text-red-500
            transition-colors
            duration-200
            w-5 h-5
            sm:w-6 sm:h-6
            flex items-center justify-center
          "
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-start gap-3 pr-12 mt-6">
        <div className="flex-grow">
          {/* Emoji Badge and Priority */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="
                text-2xl
                hover:scale-110
                transition-transform
                duration-200
                cursor-pointer
                bg-transparent
                border-none
                p-0
              "
            >
              {emoji}
            </button>
            <h3 className="font-[DM Sans] text-[17px] text-gray-800 font-semibold">{task.title}</h3>

            {/* Priority Indicator */}
            <div className="relative inline-block align-middle ml-2">
              <button
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                className={`
                  w-2.5 h-2.5 rounded-full
                  ${priorityConfig[currentPriority].bg}
                  hover:scale-110 transition-transform duration-200 cursor-pointer
                  inline-flex items-center justify-center
                `}
                title={`Priority: ${currentPriority}`}
              >
                {/* No icon needed, background color creates the circle */}
              </button>

              {/* Priority Dropdown */}
              {showPriorityDropdown && (
                <div className="
                  absolute top-full right-0 mt-2
                  bg-white/90 backdrop-blur-md
                  rounded-lg shadow-lg
                  p-2 grid grid-cols-1 gap-1
                  z-10 animate-slide-in
                ">
                  {(Object.keys(priorityConfig) as TaskPriority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePriorityChange(p)}
                      className={`
                        flex items-center gap-2 px-3 py-1 rounded-md text-sm
                        hover:bg-gray-100 transition-colors duration-100
                        ${p === currentPriority ? 'bg-gray-100 font-medium' : ''}
                      `}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${priorityConfig[p].bg}`}></span>
                      <span>{p}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="
              absolute
              bg-white/90
              backdrop-blur-md
              rounded-lg
              shadow-lg
              p-2
              mt-2
              grid grid-cols-5 gap-1
              z-10
              animate-slide-in
            ">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => {
                    setEmoji(e);
                    setShowEmojiPicker(false);
                  }}
                  className="
                    text-2xl
                    hover:scale-110
                    transition-transform
                    duration-100
                    p-1
                    rounded-md
                    hover:bg-gray-100
                  "
                >
                  {e}
                </button>
              ))}
            </div>
          )}
          <p className="font-[DM Sans] text-[17px] text-gray-800 mt-1">{getPlaceholderText()}</p>

          {/* Status Selector */}
          <div className="relative inline-block text-left mt-4">
            <div>
              <button
                type="button"
                className={`
                  inline-flex justify-center w-full
                  rounded-lg
                  px-4 py-2
                  text-sm font-medium
                  ${statusColors[task.status].bg}
                  ${statusColors[task.status].text}
                  hover:opacity-90
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500
                  transition-all
                  duration-200
                `}
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                {task.status}
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {showStatusDropdown && (
              <div
                className="
                  origin-top-right
                  absolute left-0 mt-2 w-40 rounded-md shadow-lg
                  bg-white ring-1 ring-black ring-opacity-5
                  focus:outline-none
                  animate-slide-in
                "
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
              >
                <div className="py-1" role="none">
                  {(Object.keys(statusColors) as TaskStatus[]).map((status) => (
                    <a
                      key={status}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleStatusChange(status);
                        setShowStatusDropdown(false);
                      }}
                      className={`
                        ${statusColors[status].text}
                        block px-4 py-2 text-sm
                        hover:bg-gray-100
                        ${task.status === status ? 'bg-gray-100 font-medium' : ''}
                      `}
                      role="menuitem"
                    >
                      {status}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 