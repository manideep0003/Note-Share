import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Academic Modal with backdrop blur, keyboard accessibility, and editorial styling
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
}) => {
  // Handle ESC key press & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Glassmorphic Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/45 backdrop-blur-sm transition-opacity"
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className={`
          relative w-full ${sizeClasses[size]}
          bg-[#FCFBF9] rounded-academic-xl
          border border-ivory-300
          shadow-academic-lg
          overflow-hidden
          transform transition-all
          z-10
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-ivory-300/80 bg-ivory-50/50">
          <div>
            {title && (
              <h3 id="modal-title" className="font-editorial text-2xl text-navy-900 leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-navy-700/70 mt-1 font-sans">
                {subtitle}
              </p>
            )}
          </div>

          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1.5 -mr-1.5 text-navy-700/60 hover:text-navy-900 rounded-lg hover:bg-ivory-200/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="px-6 py-5 text-navy-900 text-sm max-h-[70vh] overflow-y-auto font-sans">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-ivory-300/80 bg-ivory-50/60">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
