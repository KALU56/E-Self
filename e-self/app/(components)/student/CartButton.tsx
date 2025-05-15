// app/(components)/CartButton.tsx
"use client";
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function CartButton() {
  const { cartItems } = useCart();

  return (
    <Link href="/cart" className="relative hover:text-[#8E1616] transition-colors">
      <ShoppingCart className="w-6 h-6" />
      {cartItems.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#8E1616] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {cartItems.length}
        </span>
      )}
    </Link>
  );
}