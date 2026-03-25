import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ variant = 'primary', className, children, ...rest }: Props) {
  const base = 'inline-flex items-center justify-center px-5 py-2.5 text-sm font-mincho focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kon disabled:opacity-50 transition-colors';
  const variants = {
    primary: 'bg-sumi text-washi hover:bg-kon-deep',
    secondary: 'bg-transparent border border-sumi text-sumi hover:bg-washi-light',
    ghost: 'text-muted hover:text-sumi hover:bg-washi-light',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className ?? ''}`} {...rest}>
      {children}
    </button>
  );
}
