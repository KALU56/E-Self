'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import CartButton from './CartButton';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const hideOnPaths = [
    '/dashboard',
    '/instructor',
    '/instructor/signin',
    '/instructor/signup'
  ];
  if (hideOnPaths.some((path) => pathname.startsWith(path))) return null;

  const handleSearch = () => {
    if (search.trim()) {
      console.log('Searching for:', search);
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#EEEEEE] shadow-md w-full z-50">
      <Link href="/" className="text-xl font-bold text-[#1D1616]">
        <span className="text-[#1D1616]">E</span>
        <span className="text-[#8E1616]">-Self</span>
      </Link>

      {/* Search Bar */}
      <div className="relative hidden lg:block w-full max-w-2xl mx-6">
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="pr-10"
        />
        {search && (
          <X
            className="absolute right-10 top-2.5 cursor-pointer text-gray-500"
            onClick={() => setSearch('')}
          />
        )}
        <Search className="absolute right-4 top-2.5 text-gray-500" />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <CartButton />

        {/* Mobile Menu */}
        <Button variant="ghost" className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="h-5 w-5" />
        </Button>

        {/* Authenticated */}
        {user ? (
          <div className="hidden lg:flex items-center gap-4">
            {user.role === 'student' && (
              <>
                <Link href="/my-courses" className="text-sm hover:text-[#8E1616]">My Courses</Link>
                <Link href="/profile" className="text-sm hover:text-[#8E1616]">Profile</Link>
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full h-8 w-8 p-0">
                  <span className="text-sm font-bold">
                    {user.email ? user.email[0].toUpperCase() : '?'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/instructor/signup">
              <Button className="bg-[#8E1616] hover:bg-[#D84040] text-white">Instructor</Button>
            </Link>
            <Link href="/student/signup">
              <Button className="bg-[#8E1616] hover:bg-[#D84040] text-white">Sign Up</Button>
            </Link>
            <Link href="/student/signin">
              <Button className="bg-[#8E1616] hover:bg-[#D84040] text-white">Sign In</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && !user && (
        <div className="absolute top-16 right-4 bg-white w-48 shadow-lg p-4 rounded-md flex flex-col gap-3 lg:hidden">
          <Link href="/instructor/signup">
            <Button className="w-full bg-[#8E1616] hover:bg-[#D84040] text-white">Instructor</Button>
          </Link>
          <Link href="/student/signup">
            <Button className="w-full bg-[#8E1616] hover:bg-[#D84040] text-white">Sign Up</Button>
          </Link>
          <Link href="/student/signin">
            <Button className="w-full bg-[#8E1616] hover:bg-[#D84040] text-white">Sign In</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
