import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { getSocket } from '../services/socket';
import StatsCard from '../components/StatsCard';
import { CheckSquare, AlertCircle, TrendingUp, CheckCircle, BarChart3 } from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (error) {
      console.error('Error fetching dashboard tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    const socket = getSocket();
    if (!socket) return;

    socket.on('task_created', fetchTasks);
    socket.on('task_updated', fetchTasks);
    socket.on('task_deleted', fetchTasks);

    return () => {
      socket.off('task_created', fetchTasks);
      socket.off('task_updated', fetchTasks);
      socket.off('task_deleted', fetchTasks);
    };
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriorityCount = tasks.filter((t) => t.priority === 'High').length;
  const medPriorityCount = tasks.filter((t) => t.priority === 'Medium').length;
  const lowPriorityCount = tasks.filter((t) => t.priority === 'Low').length;

  const doughnutData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [pendingTasks, inProgressTasks, completedTasks],
        backgroundColor: [
          'rgba(244, 63, 94, 0.2)',
          'rgba(14, 165, 233, 0.2)',
          'rgba(16, 185, 129, 0.2)',
        ],
        borderColor: [
          'rgba(244, 63, 94, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderWidth: 1.5,
      },
    ],
  };

  const barData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Tasks Count',
        data: [lowPriorityCount, medPriorityCount, highPriorityCount],
        backgroundColor: [
          'rgba(16, 185, 129, 0.2)',
          'rgba(245, 158, 11, 0.2)',
          'rgba(244, 63, 94, 0.2)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(244, 63, 94, 0.8)',
        ],
        borderWidth: 1.5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11 },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#94a3b8' },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#94a3b8', stepSize: 1 },
      },
    },
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Dashboard Overview</h2>
        <p className="text-slate-400 text-sm mt-1.5">Real-time statistics and activity monitoring</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={totalTasks}
          icon={CheckSquare}
          color="indigo"
          description="Total active tasks catalogued"
          loading={loading}
        />
        <StatsCard
          title="Pending Tasks"
          value={pendingTasks}
          icon={AlertCircle}
          color="amber"
          description="Awaiting action"
          loading={loading}
        />
        <StatsCard
          title="Completed Tasks"
          value={completedTasks}
          icon={CheckCircle}
          color="green"
          description="Successfully completed tasks"
          loading={loading}
        />
        <StatsCard
          title="Completion Progress"
          value={`${completionPercentage}%`}
          icon={TrendingUp}
          color="sky"
          description="Task completion efficiency ratio"
          loading={loading}
        />
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-slate-800/80">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-slate-300">Completion Milestone Progress</span>
          <span className="text-sm font-bold text-sky-400">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-slate-900/60 rounded-full h-3.5 border border-slate-800/50 p-0.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between h-[360px]">
          <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2 uppercase tracking-wider text-[11px]">
            <BarChart3 className="w-4 h-4 text-sky-400" /> Task Status Distribution
          </h3>
          <div className="flex-1 relative flex items-center justify-center min-h-0">
            {loading ? (
              <div className="w-24 h-24 border-4 border-slate-800 border-t-sky-400 rounded-full animate-spin"></div>
            ) : totalTasks === 0 ? (
              <span className="text-slate-500 text-xs">No data to display.</span>
            ) : (
              <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
            )}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 flex flex-col justify-between h-[360px]">
          <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2 uppercase tracking-wider text-[11px]">
            <BarChart3 className="w-4 h-4 text-sky-400" /> Tasks by Priority Level
          </h3>
          <div className="flex-1 relative flex items-center justify-center min-h-0">
            {loading ? (
              <div className="w-24 h-24 border-4 border-slate-800 border-t-sky-400 rounded-full animate-spin"></div>
            ) : totalTasks === 0 ? (
              <span className="text-slate-500 text-xs">No data to display.</span>
            ) : (
              <Bar data={barData} options={chartOptions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
