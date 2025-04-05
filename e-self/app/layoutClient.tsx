'use client';

import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './(components)/student/Header';
import LandingHeader from './(components)/instructor/LandingHeader';
import Footer from './(components)/student/Footer';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  const isInstructorPage = pathname.startsWith('/instructor') || pathname.startsWith('/dashboard');

  return (
    <CartProvider>
     
      {isInstructorPage ? <LandingHeader /> : <Header />}

      <main className="flex-1 container mx-auto p-4">{children}</main>

   
      {!isInstructorPage && <Footer />}
    </CartProvider>
  );
}
