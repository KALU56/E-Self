// app/layoutClient.tsx
'use client';

// import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './(components)/student/Header';
import Footer from './(components)/student/Footer';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isLandingPage = pathname === '/landing';

  return (
    <CartProvider>
      {!isLandingPage && <Header />}
      <main className="flex-1 container mx-auto p-4">{children}</main>
      {!isLandingPage && <Footer />}
    </CartProvider>
  );
}
