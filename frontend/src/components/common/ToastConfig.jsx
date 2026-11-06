import React from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * Global React Hot Toast configuration styled for the NoteShare Academic Design System
 */
export const ToastConfig = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      toastOptions={{
        duration: 4000,
        className: 'font-sans text-sm',
        style: {
          background: '#FCFBF9',
          color: '#172B4D',
          border: '1px solid #E3DFD3',
          borderRadius: '10px',
          boxShadow: '0 4px 14px -2px rgba(23, 43, 77, 0.08), 0 8px 20px -4px rgba(23, 43, 77, 0.04)',
          padding: '12px 16px',
        },
        success: {
          iconTheme: {
            primary: '#5B7F67', // Academic Sage
            secondary: '#FFFFFF',
          },
          style: {
            borderLeft: '4px solid #5B7F67',
          },
        },
        error: {
          iconTheme: {
            primary: '#C53030', // Refined Red
            secondary: '#FFFFFF',
          },
          style: {
            borderLeft: '4px solid #C53030',
          },
        },
        loading: {
          iconTheme: {
            primary: '#172B4D', // Academic Navy
            secondary: '#F7F5F0',
          },
        },
      }}
    />
  );
};

export default ToastConfig;

