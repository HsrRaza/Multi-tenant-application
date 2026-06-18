import React from 'react';
import Loader from './Loader';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-bg disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-brand-primary hover:bg-brand-primary-hover text-brand-text border border-transparent shadow-sm',
    secondary: 'bg-transparent hover:bg-brand-card text-brand-text border border-brand-border',
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-transparent',
    ghost: 'bg-transparent hover:bg-brand-card/50 text-brand-muted hover:text-brand-text border border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader size="small" className="mr-2" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
