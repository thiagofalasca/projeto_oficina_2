'use client';

import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface SignOutButtonProps {
  type?: 'desktop' | 'mobile';
}

export function SignOutButton({ type }: SignOutButtonProps) {
  return (
    <button
      data-testid="sign-out-button"
      onClick={() => signOut()}
      className={cn('cursor-pointer', {
        'max-xl:mx-auto': type === 'desktop',
      })}
    >
      <PowerIcon className="w-6 text-gray-700" />
    </button>
  );
}
