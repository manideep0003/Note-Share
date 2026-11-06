import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ToastConfig from '../common/ToastConfig';

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-100 text-navy-900 font-sans selection:bg-navy-900 selection:text-ivory-100">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <Outlet />
      </main>
      <Footer />
      <ToastConfig />
    </div>
  );
};

export default AppLayout;

