import React from 'react';
import { X } from 'lucide-react';

export const InputField = React.memo(({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  onClear
}: {
  label: string;
  icon: any;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  onClear: () => void;
}) => (
  <div className="space-y-0.5 group">
    <label className="text-[8px] font-bold text-zinc-500 ml-1 uppercase tracking-wider font-outfit">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-rose-500 transition-colors">
        <Icon size={13} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        suppressHydrationWarning
        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md py-1.5 pl-8 pr-8 text-[13px] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all placeholder:text-zinc-600 font-outfit tracking-tight"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          suppressHydrationWarning
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          aria-label={`Clear ${label}`}
        >
          <X size={12} />
        </button>
      )}
    </div>
  </div>
));

InputField.displayName = 'InputField';
