import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Shield, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">User Account</h2>
        <p className="text-slate-400 text-sm mt-1.5 font-medium">Manage your identity credentials and roles</p>
      </div>

      <div className="glass-panel border border-slate-800/80 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden group">
        <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/15 transition-colors duration-300"></div>

        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center font-bold text-3xl text-slate-950 shadow-xl mb-6 ring-4 ring-sky-500/20">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <h3 className="text-xl font-bold text-slate-200">{user?.name}</h3>
        <span className={`text-[10px] uppercase font-extrabold tracking-wider px-3 py-1 rounded-full border mt-2 ${
          user?.role === 'Admin'
            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
            : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
        }`}>
          {user?.role} Role
        </span>

        <div className="w-full mt-8 space-y-4 border-t border-slate-800/40 pt-6 text-left max-w-md mx-auto">
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-slate-900/30 border border-slate-800/50">
            <Mail className="w-4 h-4 text-sky-400" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email Address</p>
              <p className="text-sm font-medium text-slate-300">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-slate-900/30 border border-slate-800/50">
            <Shield className="w-4 h-4 text-indigo-400" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">System Permissions</p>
              <p className="text-sm font-medium text-slate-300">
                {user?.role === 'Admin' ? 'Global Read & Write Access' : 'Standard Read & Write Access'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-8 px-6 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-slate-950 text-rose-400 font-bold text-sm transition-all duration-200 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Logout Session
        </button>
      </div>
    </div>
  );
};

export default Profile;
