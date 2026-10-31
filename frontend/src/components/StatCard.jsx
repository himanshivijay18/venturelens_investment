import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'purple', trend }) => {
  const colorMap = {
    purple: 'from-purple-600/20 to-indigo-600/10 border-purple-500/30 text-purple-400 group-hover:border-purple-400/50',
    emerald: 'from-emerald-600/20 to-teal-600/10 border-emerald-500/30 text-emerald-400 group-hover:border-emerald-400/50',
    amber: 'from-amber-600/20 to-orange-600/10 border-amber-500/30 text-amber-400 group-hover:border-amber-400/50',
    indigo: 'from-indigo-600/20 to-blue-600/10 border-indigo-500/30 text-indigo-400 group-hover:border-indigo-400/50',
    rose: 'from-rose-600/20 to-pink-600/10 border-rose-500/30 text-rose-400 group-hover:border-rose-400/50',
  };

  const selectedColor = colorMap[color] || colorMap.purple;

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${selectedColor} border backdrop-blur-md shadow-card transition-all duration-300 hover:-translate-y-0.5 group relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {value}
        </h3>
        {trend && (
          <span className="text-xs font-semibold text-emerald-400">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
