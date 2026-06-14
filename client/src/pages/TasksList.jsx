import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { getSocket } from '../services/socket';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { Search, Plus, LayoutGrid, List } from 'lucide-react';

const TasksList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('createdAtDesc');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isGridView, setIsGridView] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (filterPriority !== 'All') params.priority = filterPriority;
      if (filterStatus !== 'All') params.status = filterStatus;
      if (sortBy) params.sortBy = sortBy;

      const res = await API.get('/tasks', { params });
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTasks();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, filterPriority, filterStatus, sortBy]);

  useEffect(() => {
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

  const handleOpenCreateModal = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleModalSubmit = async (taskData) => {
    try {
      if (selectedTask) {
        await API.put(`/tasks/${selectedTask._id}`, taskData);
      } else {
        await API.post('/tasks', taskData);
      }
      setModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/tasks/${taskId}`);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Task Directory</h2>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">Create, edit, and organize system tasks</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-slate-950 stroke-[3]" /> Add Task
        </button>
      </div>

      <div className="glass-panel border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl form-input text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 rounded-xl form-input text-xs"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl form-input text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl form-input text-xs"
            >
              <option value="createdAtDesc">Newest Created</option>
              <option value="createdAtAsc">Oldest Created</option>
              <option value="dueDateAsc">Due Date: Ascending</option>
              <option value="dueDateDesc">Due Date: Descending</option>
            </select>
          </div>

          <div className="flex border border-slate-800 rounded-xl overflow-hidden p-0.5 bg-slate-900/30">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-1.5 rounded-lg transition-colors ${
                isGridView ? 'bg-sky-500/10 text-sky-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-1.5 rounded-lg transition-colors ${
                !isGridView ? 'bg-sky-500/10 text-sky-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {loading && tasks.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 h-56 animate-pulse flex flex-col justify-between">
              <div>
                <div className="flex gap-2">
                  <div className="h-4 bg-slate-800 rounded w-16"></div>
                  <div className="h-4 bg-slate-800 rounded w-16"></div>
                </div>
                <div className="h-5 bg-slate-800 rounded w-1/2 mt-4"></div>
                <div className="h-4 bg-slate-800 rounded w-3/4 mt-3"></div>
              </div>
              <div className="h-4 bg-slate-800 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-panel border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
          <p className="text-sm font-semibold">No tasks catalogued matching current selections.</p>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            Create your first task
          </button>
        </div>
      ) : (
        <div
          className={
            isGridView
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
          }
        >
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
              isGridView={isGridView}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        task={selectedTask}
      />
    </div>
  );
};

export default TasksList;
