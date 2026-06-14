import React, { useState } from 'react';
import { Calendar, Edit, Trash2, MoreVertical, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onEdit, onDelete, isGridView = true }) => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Low':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'In Progress':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'Pending':
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getDueDateLabel = (dateStr) => {
    const due = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', style: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
    } else if (diffDays === 0) {
      return { text: 'Due Today', style: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    } else if (diffDays === 1) {
      return { text: 'Due Tomorrow', style: 'text-sky-400 bg-sky-500/10 border-sky-500/20' };
    } else {
      return { text: `${diffDays} days left`, style: 'text-slate-400 bg-slate-800 border-slate-700' };
    }
  };

  const dueLabel = getDueDateLabel(task.dueDate);

  if (!isGridView) {
    return (
      <div className="glass-card rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative group animate-slide-up">
        {/* Title, Badges, and Description */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-200 truncate group-hover:text-sky-400 transition-colors duration-200">
              {task.title}
            </h4>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getPriorityStyle(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getStatusStyle(task.status)}`}>
              {task.status}
            </span>
          </div>
          {task.description && (
            <p className="text-xs text-slate-400 mt-1 truncate max-w-xl">
              {task.description}
            </p>
          )}
        </div>

        {/* Info & Actions */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {/* Due date indicator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-medium text-[11px]">{new Date(task.dueDate).toLocaleDateString()}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ml-1.5 ${dueLabel.style}`}>
              {dueLabel.text}
            </span>
          </div>

          {/* User initials (Admin view) */}
          {user?.role === 'Admin' && task.createdBy && (
            <div className="flex items-center gap-1 text-slate-500 bg-slate-900/30 px-2 py-0.5 rounded-lg border border-slate-800/50 text-[10px]">
              <span className="truncate max-w-[60px]">{task.createdBy.name}</span>
            </div>
          )}

          {/* Action Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-32 glass-panel border border-slate-800 rounded-xl shadow-xl py-1 z-20 animate-fade-in">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(task);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 text-left"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Task
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(task._id);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Task
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between h-56 relative group animate-slide-up">
      <div>
        <div className="flex justify-between items-start">
          <div className="flex gap-2 items-center flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getPriorityStyle(task.priority)}`}>
              {task.priority} Priority
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusStyle(task.status)}`}>
              {task.status}
            </span>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                <div className="absolute right-0 mt-2 w-32 glass-panel border border-slate-800 rounded-xl shadow-xl py-1 z-20 animate-fade-in">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(task);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 text-left"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Task
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(task._id);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Task
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <h4 className="text-base font-semibold text-slate-200 mt-3 truncate group-hover:text-sky-400 transition-colors duration-200">
          {task.title}
        </h4>
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {task.description || 'No description provided.'}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/40 flex justify-between items-center text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-medium text-[11px]">{new Date(task.dueDate).toLocaleDateString()}</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ml-1.5 ${dueLabel.style}`}>
            {dueLabel.text}
          </span>
        </div>

        {user?.role === 'Admin' && task.createdBy && (
          <div className="flex items-center gap-1.5 text-slate-500 bg-slate-900/30 px-2 py-0.5 rounded-lg border border-slate-800/50">
            <User className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] truncate max-w-[70px]">{task.createdBy.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
