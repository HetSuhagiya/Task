import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  completedTasksToday: number;
  streak: number;
}

export const Sidebar = ({ isOpen, onClose, completedTasksToday, streak }: SidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64
          bg-white shadow-lg
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 fixed h-full top-0 left-0 z-50' : '-translate-x-full fixed h-full top-0 left-0 z-50'} /* Mobile positioning */
          lg:static lg:translate-x-0 lg:h-auto lg:shadow-none lg:z-auto /* Desktop positioning */
        `}
      >
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Task Manager</h2>
            <div className="mt-4 space-y-2">
              <div className="text-sm text-gray-600">
                Tasks Done Today: {completedTasksToday}
              </div>
              <div className="text-sm text-gray-600">
                Current Streak: {streak} days
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              to="/"
              className={`
                flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200
                ${isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>

            <Link
              to="/calendar"
              className={`
                flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200
                ${isActive('/calendar') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </Link>

            <Link
              to="/completed"
              className={`
                flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200
                ${isActive('/completed') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Completed
            </Link>

            <Link
              to="/insights"
              className={`
                flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200
                ${isActive('/insights') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Insights
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
}; 