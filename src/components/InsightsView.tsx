import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Task } from '../types/task';

interface InsightsViewProps {
  tasks: Task[];
}

interface TimeData {
  title: string;
  duration: number;  // in minutes
  startTime: string;
  endTime: string;
}

export const InsightsView = ({ tasks }: InsightsViewProps) => {
  const [timeData, setTimeData] = useState<TimeData[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Calculate time spent for each completed task
    const completedTasks = tasks.filter(
      task => task.status === 'Done' && task.startTime && task.endTime
    );

    const data = completedTasks.map(task => {
      const start = new Date(task.startTime!).getTime();
      const end = new Date(task.endTime!).getTime();
      const duration = Math.round((end - start) / (1000 * 60)); // Convert to minutes

      return {
        title: task.title,
        duration,
        startTime: task.startTime!,
        endTime: task.endTime!,
      };
    });

    // Sort by duration (longest first)
    data.sort((a, b) => b.duration - a.duration);

    setTimeData(data);

    // Calculate total time
    const total = data.reduce((sum, task) => sum + task.duration, 0);
    setTotalTime(total);
    setIsLoading(false);
  }, [tasks]);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="
          bg-white/90
          backdrop-blur-sm
          p-3
          rounded-lg
          shadow-lg
          border border-gray-100
          text-sm
        ">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-gray-600">
            Duration: {formatDuration(data.duration)}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {new Date(data.startTime).toLocaleTimeString()} - {new Date(data.endTime).toLocaleTimeString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Time Insights
        </h1>
        <p className="text-gray-600">
          Track your productivity and time management
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Total Time Spent
          </h3>
          <p className="text-3xl font-semibold text-blue-600">
            {formatDuration(totalTime)}
          </p>
        </div>
        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Tasks Completed
          </h3>
          <p className="text-3xl font-semibold text-green-600">
            {timeData.length}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="glass p-6 rounded-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Time Spent on Tasks
        </h2>
        {timeData.length > 0 ? (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timeData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  type="number"
                  tickFormatter={(value) => formatDuration(value)}
                  stroke="#94a3b8"
                  tick={{ fill: '#64748b' }}
                />
                <YAxis
                  type="category"
                  dataKey="title"
                  width={150}
                  stroke="#94a3b8"
                  tick={{ fill: '#64748b' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="duration"
                  fill="url(#colorGradient)"
                  radius={[0, 4, 4, 0]}
                  animationDuration={1000}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-gray-500 text-center">
              No completed tasks with time tracking data yet.
              <br />
              <span className="text-sm">
                Complete some tasks to see your time insights.
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 