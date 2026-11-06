import React from 'react';
import { BookOpen } from 'lucide-react';

/**
 * Academic Loader component with support for inline, card-level, and fullscreen states
 */
export const Loader = ({
  size = 'md',
  message = 'Loading...',
  fullScreen = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-[2.5px]',
    lg: 'w-10 h-10 border-3',
    xl: 'w-14 h-14 border-4',
  };

  const loaderContent = (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3 text-navy-900 ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Spinner Ring */}
        <div
          className={`
            ${sizeMap[size]}
            rounded-full
            border-ivory-300
            border-t-navy-900
            border-r-navy-700
            animate-spin
          `}
        />
        {/* Center academic icon for larger loaders */}
        {(size === 'lg' || size === 'xl') && (
          <BookOpen className="w-4 h-4 text-navy-800 absolute opacity-75" />
        )}
      </div>

      {message && (
        <p className="text-xs font-medium tracking-wide text-navy-800/80 uppercase font-sans animate-pulse">
          {message}
        </p>
      )}
      <span className="sr-only">{message}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ivory-100/90 backdrop-blur-sm">
        <div className="clay-card p-8 rounded-academic-xl flex flex-col items-center max-w-xs w-full text-center">
          {loaderContent}
        </div>
      </div>
    );
  }

  return loaderContent;
};

export default Loader;

