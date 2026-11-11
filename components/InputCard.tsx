import React from 'react';

interface InputCardProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  prefix?: string;
  step?: number;
  icon?: React.ReactNode;
}

export const InputCard: React.FC<InputCardProps> = ({ 
  label, 
  value, 
  onChange, 
  prefix = "£", 
  step = 0.01,
  icon
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-2 text-slate-500 text-sm font-medium">
        {icon && <span className="text-slate-400">{icon}</span>}
        {label}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          className={`w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pr-4 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${prefix ? 'pl-8' : 'pl-4'}`}
        />
      </div>
    </div>
  );
};