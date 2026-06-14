import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, description, loading }) => {
  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 h-32 flex flex-col justify-between animate-pulse">
        <div className="flex justify-between items-start">
          <div className="h-4 bg-slate-800 rounded w-24"></div>
          <div className="w-10 h-10 rounded-xl bg-slate-800"></div>
        </div>
        <div className="h-8 bg-slate-800 rounded w-16"></div>
      </div>
    );
  }

  const colorMap = {
    sky: {
      iconBg: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
      text: 'text-sky-400',
    },
    green: {
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      text: 'text-emerald-400',
    },
    amber: {
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      text: 'text-amber-400',
    },
    indigo: {
      iconBg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
      text: 'text-indigo-400',
    },
  };

  const theme = colorMap[color] || colorMap.sky;

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-sky-500/5 rounded-full blur-xl group-hover:bg-sky-500/10 transition-colors duration-300"></div>
      
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-3xl font-bold text-slate-100 tracking-tight">{value}</h3>
        {description && (
          <p className="text-xs text-slate-500 mt-1 font-medium">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
