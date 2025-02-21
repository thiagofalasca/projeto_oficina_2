import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

interface AuthFooterProps {
  link: string;
  linkText: string;
  description?: string;
}

const AuthFooter = ({ link, linkText, description }: AuthFooterProps) => {
  return (
    <footer className="flex-center text-sm">
      {description && <p className="text-gray-600">{description}</p>}
      <Link
        href={link}
        className={cn('auth-link text-gray-600', {
          'ml-1 text-blue-600': description,
        })}
      >
        {linkText}
      </Link>
    </footer>
  );
};

export default AuthFooter;
