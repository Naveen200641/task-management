import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../services/socket';
import { Bell, Menu, X, LayoutDashboard, CheckSquare, User, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleTaskCreated = (data) => {
      const message = `${data.sender} created task: "${data.task.title}"`;
      addNotification(message);
    };

    const handleTaskUpdated = (data) => {
      const message = `${data.sender} updated task: "${data.task.title}"`;
      addNotification(message);
    };

    const handleTaskDeleted = (data) => {
      const message = `${data.sender} deleted task: "${data.title}"`;
      addNotification(message);
    };

    socket.on('task_created', handleTaskCreated);
    socket.on('task_updated', handleTaskUpdated);
    socket.on('task_deleted', handleTaskDeleted);

    return () => {
      socket.off('task_created', handleTaskCreated);
      socket.off('task_updated', handleTaskUpdated);
      socket.off('task_deleted', handleTaskDeleted);
    };
  }, [user]);

  const addNotification = (message) => {
    const newNotif = {
      id: Date.now(),
      message,
      createdAt: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 10));
    setUnreadCount((prev) => prev + 1);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <header className="h-16 glass-panel border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-slate-400 hover:text-slate-200 focus:outline-none hidden md:block"
        >
          <Menu className="w-6 h-6" />
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-400 hover:text-slate-200 focus:outline-none md:hidden"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="text-lg font-semibold text-slate-200 md:hidden flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-sky-500 flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-slate-900" />
          </div>
          <span>TaskFlow</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) markAllAsRead();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 relative transition-all duration-200"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center text-[9px] font-bold text-slate-950 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass-panel border border-slate-800 rounded-2xl shadow-xl py-2 overflow-hidden animate-fade-in z-50">
              <div className="px-4 py-2 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/30">
                <span className="font-semibold text-sm text-slate-200">Notifications</span>
                {notifications.length > 0 && (
                  <button
                    onClick={() => setNotifications([])}
                    className="text-xs text-sky-400 hover:text-sky-300 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-slate-500 text-xs">
                    No new alerts at this time.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 hover:bg-slate-800/30 border-b border-slate-800/20 text-xs transition-colors duration-150 ${
                        !notif.read ? 'bg-sky-500/5 border-l-2 border-sky-400' : ''
                      }`}
                    >
                      <p className="text-slate-300 font-medium leading-relaxed">{notif.message}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {new Date(notif.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center font-bold text-xs text-slate-950 shadow-inner">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="text-sm font-medium text-slate-300 hidden md:block">{user?.name}</span>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full glass-panel border-b border-slate-800 shadow-2xl flex flex-col p-4 space-y-2 md:hidden animate-fade-in z-40">
          <NavLink
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                isActive ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>
          <NavLink
            to="/tasks"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                isActive ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400'
              }`
            }
          >
            <CheckSquare className="w-5 h-5" />
            Tasks
          </NavLink>
          <NavLink
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                isActive ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400'
              }`
            }
          >
            <User className="w-5 h-5" />
            Profile
          </NavLink>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
