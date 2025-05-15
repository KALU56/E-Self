'use client';

import Link from 'next/link';
// import { usePathname } from 'next/navigation';

const LandingHeader = () => {
  // const pathname = usePathname();

  return (
    <header className="w-screen bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="w-full flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/instructor/landing" className="text-2xl font-bold flex items-center">
          <span className="text-[#1D1616]">E</span>
          <span className="text-[#8E1616]">-Self</span>
        </Link>

        {/* Sign out */}
        <Link
          href="/"
          className="px-4 py-2 border border-[#1D1616] rounded-md text-sm hover:bg-[#8E1616] hover:text-white transition"
        >
          Sign Out
        </Link>
      </div>
    </header>
  );
};

export default LandingHeader;
