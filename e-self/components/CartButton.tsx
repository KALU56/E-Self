'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../app/context/CartContext'; // Adjust path if necessary

export default function CartButton() {
  // Now useCart provides cartItems (the array)
  const { cartItems } = useCart();

  // Safely check length of the array
  const cartCount = Array.isArray(cartItems) ? cartItems.length : 0;

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6 text-[#8E1616]" />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-1 text-xs">
          {cartCount}
        </span>
      )}
    </Link>
  );
}