import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const PublicLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#181615]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton variant="floating" />
    </div>
  );
};
