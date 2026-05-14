import React from 'react';

const Input = ({
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  disabled = false,
  error = '',
  className = '',
  icon: Icon,
  ...props
}) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-light-muted dark:text-dark-muted" />
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-2 rounded-lg
          border ${error ? 'border-red-500' : 'border-light-border dark:border-dark-border'}
          bg-light-bg dark:bg-dark-bg
          text-light-text dark:text-dark-text
          placeholder-light-muted dark:placeholder-dark-muted
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          ${Icon ? 'pl-10' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;
