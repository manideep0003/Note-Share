import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component matching the Academic & Claymorphic design system
 */
export const Button = React.forwardRef(
  (
    {
      children,
      type = 'button',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      disabled = false,
      fullWidth = false,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      'inline-flex items-center justify-center font-sans tracking-wide transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-900 select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.985]';

    // Size variants
    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
      md: 'text-sm px-4 py-2.5 rounded-academic gap-2 font-medium',
      lg: 'text-base px-5 py-3 rounded-academic-lg gap-2.5 font-semibold',
    };

    // Style variants adhering strictly to NoteShare visual identity
    const variantStyles = {
      // Primary Academic Navy
      primary:
        'bg-navy-900 text-ivory-50 hover:bg-navy-800 shadow-academic-sm hover:shadow-academic border border-navy-950/20 active:bg-navy-950',
      
      // Secondary Warm Neutral
      secondary:
        'bg-ivory-200 text-navy-900 hover:bg-ivory-300/80 border border-ivory-300 shadow-academic-sm',
      
      // Academic Outline
      outline:
        'bg-transparent text-navy-900 border border-navy-900/25 hover:bg-navy-900/[0.04] hover:border-navy-900/50',
      
      // Restrained Claymorphism Button
      clay:
        'clay-button text-navy-900 font-medium hover:bg-white',
      
      // Ghost Minimal
      ghost:
        'bg-transparent text-navy-800 hover:bg-navy-900/[0.05] border border-transparent',
      
      // Academic Sage Accent
      sage:
        'bg-sage-100 text-sage-900 border border-sage-200 hover:bg-sage-200/80 shadow-academic-sm',
      
      // Academic Lavender Accent
      lavender:
        'bg-lavender-100 text-lavender-900 border border-lavender-200 hover:bg-lavender-200/80 shadow-academic-sm',
      
      // Danger / Destructive
      danger:
        'bg-red-700 text-white hover:bg-red-800 border border-red-900/30 shadow-academic-sm focus-visible:ring-red-600',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        onClick={onClick}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {LeftIcon && <LeftIcon className="w-4 h-4 shrink-0 text-current" />}
            <span>{children}</span>
            {RightIcon && <RightIcon className="w-4 h-4 shrink-0 text-current" />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

