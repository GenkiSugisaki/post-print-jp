import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function TextInput({ label, hint, id, className, ...rest }: Props) {
  const inputId = id ?? label;
  return (
    <div>
      <label
        htmlFor={inputId}
        className="block font-mincho text-sm font-medium tracking-[0.08em] text-sumi mb-2.5"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`block w-full bg-transparent border-0 border-b border-hairline px-0.5 py-2.5 text-sm text-sumi placeholder:text-muted-light placeholder:font-light focus:outline-none focus:ring-0 focus:border-kon transition-colors ${className ?? ''}`}
        {...rest}
      />
      {hint && <p className="mt-2 text-xs text-muted leading-relaxed">{hint}</p>}
    </div>
  );
}
