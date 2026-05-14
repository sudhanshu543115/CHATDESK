import React from 'react';

const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'md',
  status = null,
  className = '',
  onClick,
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`
        relative inline-block rounded-full overflow-hidden
        ${sizes[size]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-primary-600 flex items-center justify-center text-white font-semibold">
          {getInitials(alt)}
        </div>
      )}
      
      {status && (
        <div
          className={`
            absolute bottom-0 right-0 w-3 h-3 rounded-full border-2
            border-light-surface dark:border-dark-surface
            ${statusColors[status]}
          `}
        />
      )}
    </div>
  );
};

export default Avatar;
