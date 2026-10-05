import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#181615] lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
