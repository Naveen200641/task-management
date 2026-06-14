import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, User, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside
      className={`glass-panel border-r border-slate-800/80 transition-all duration-300 z-30 flex flex-col ${
        isOpen ? 'w-64' : 'w-20'
      } hidden md:flex`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/50">
        <div className={`flex items-center gap-3 ${!isOpen && 'justify-center w-full'}`}>
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/35">
            <CheckSquare className="w-5 h-5 text-slate-900" />
          </div>
          {isOpen && (
            <span className="font-bold text-lg bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              TaskFlow
            </span>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border-l-4 border-sky-400 shadow-inner'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                } ${!isOpen && 'justify-center px-0'}`
              }
            >
              <Icon className="w-5 h-5" />
              {isOpen && <span className="font-medium text-sm">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className="p-4 border-t border-slate-800/50 flex flex-col gap-2">
        <div className={`flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center font-bold text-slate-950 shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                user?.role === 'Admin' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-sky-500/20 text-sky-400'
              }`}>
                {user?.role}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className={`flex items-center gap-4 px-4 py-3 mt-2 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 ${
            !isOpen && 'justify-center px-0'
          }`}
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
