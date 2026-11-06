import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Reusable Academic Input component with support for labels, icons, error states, and helper text
 */
export const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      id,
      className = '',
      inputClassName = '',
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className={`w-full flex flex-col gap-1.5 ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-navy-800 flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-red-600 ml-1 font-bold">*</span>}
            </span>
          </label>
        )}

        <div className="relative flex items-center">
          {LeftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-navy-700/60">
              <LeftIcon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={`
              w-full bg-[#FCFBF9] text-navy-900 placeholder:text-navy-900/40 text-sm font-sans
              rounded-academic border transition-all duration-150
              py-2.5 px-3.5
              ${LeftIcon ? 'pl-10' : 'pl-3.5'}
              ${RightIcon ? 'pr-10' : 'pr-3.5'}
              ${
                error
                  ? 'border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 bg-red-50/20'
                  : 'border-ivory-300 hover:border-ivory-400 focus:border-navy-900 focus:ring-1 focus:ring-navy-900 shadow-academic-sm'
              }
              disabled:bg-ivory-200/50 disabled:text-navy-900/40 disabled:cursor-not-allowed
              ${inputClassName}
            `}
            {...props}
          />

          {RightIcon && (
            <div
              onClick={onRightIconClick}
              className={`absolute right-3 flex items-center text-navy-700/60 ${
                onRightIconClick ? 'cursor-pointer hover:text-navy-900 p-1' : 'pointer-events-none'
              }`}
            >
              <RightIcon className="w-4 h-4" />
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} className="text-xs text-red-600 flex items-center gap-1 font-medium mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="text-xs text-navy-700/70 mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

