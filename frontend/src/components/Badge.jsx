import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    rose: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    indigo: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  };

  // Auto detect status values
  let resolvedVariant = variant;
  const contentUpper = typeof children === 'string' ? children.toUpperCase() : '';
  if (contentUpper === 'ACCEPTED' || contentUpper === 'ACTIVE') {
    resolvedVariant = 'emerald';
  } else if (contentUpper === 'PENDING' || contentUpper === 'REQUESTED') {
    resolvedVariant = 'amber';
  } else if (contentUpper === 'REJECTED' || contentUpper === 'INACTIVE' || contentUpper === 'DEACTIVATED') {
    resolvedVariant = 'rose';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[resolvedVariant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
