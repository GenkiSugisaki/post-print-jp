import React from 'react';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
}

export function Select({ label, hint, id, children, className, ...rest }: Props) {
  const selectId = id ?? label;
  return (
    <div>
      <label
        htmlFor={selectId}
        className="block font-mincho text-sm font-medium tracking-[0.08em] text-sumi mb-2.5"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={`block w-full bg-transparent border-0 border-b border-hairline px-0.5 py-2.5 pr-7 text-sm text-sumi appearance-none focus:outline-none focus:ring-0 focus:border-kon transition-colors disabled:opacity-50 ${className ?? ''}`}
        style={{
          backgroundImage:
            'linear-gradient(45deg, transparent 50%, var(--muted) 50%), linear-gradient(135deg, var(--muted) 50%, transparent 50%)',
          backgroundPosition: 'calc(100% - 14px) 16px, calc(100% - 9px) 16px',
          backgroundSize: '5px 5px',
          backgroundRepeat: 'no-repeat',
        }}
        {...rest}
      >
        {children}
      </select>
      {hint && <p className="mt-2 text-xs text-muted leading-relaxed">{hint}</p>}
    </div>
  );
}
