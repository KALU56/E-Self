'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileDropdown({ isOpen, onClose, onLogout }: ProfileDropdownProps) {
  if (!isOpen) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DropdownMenuTrigger asChild>
        {/* The trigger can be your avatar or a button; empty trigger if controlled externally */}
        <div className="hidden" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <Link href="/profile/edit" passHref legacyBehavior>
          <DropdownMenuItem onSelect={onClose}>Edit Profile</DropdownMenuItem>
        </Link>
        <Link href="/profile/change-password" passHref legacyBehavior>
          <DropdownMenuItem onSelect={onClose}>Change Password</DropdownMenuItem>
        </Link>
        <Link href="/settings" passHref legacyBehavior>
          <DropdownMenuItem onSelect={onClose}>Settings</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            onLogout();
            onClose();
          }}
          className="text-red-600"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
