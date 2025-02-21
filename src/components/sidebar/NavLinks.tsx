'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { iconMap, type NavLink } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { SheetClose } from '../ui/sheet';

interface NavLinksProps {
  type?: 'mobile' | 'desktop';
  links: NavLink[];
}

export default function NavLinks({ type = 'desktop', links }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const isActive =
          pathname === link.route || pathname.startsWith(`${link.route}/`);
        return (
          <NavLink
            key={link.route}
            link={link}
            isActive={isActive}
            isMobile={type === 'mobile'}
          />
        );
      })}
    </>
  );
}

interface NavLinkProps {
  link: NavLink;
  isActive: boolean;
  isMobile?: boolean;
}

const NavLink = ({ link, isActive, isMobile = false }: NavLinkProps) => {
  const LinkIcon = iconMap[link.icon];

  const baseStyles = cn('flex items-center rounded-md gap-3', {
    'bg-blue-100': isActive,
  });

  const textStyles = cn('font-semibold text-gray-700', {
    '!text-blue-600': isActive,
  });

  const iconStyles = cn('w-6 h-6 text-gray-700', {
    '!text-blue-600': isActive,
  });

  const linkProps = {
    href: link.route,
    className: isMobile
      ? cn(baseStyles, 'w-full max-w-60 p-4')
      : cn(baseStyles, 'justify-center md:p-3 xl:justify-start'),
  };

  return isMobile ? (
    <SheetClose asChild>
      <Link key={link.label} {...linkProps}>
        <LinkIcon className={iconStyles} />
        <p className={textStyles}>{link.label}</p>
      </Link>
    </SheetClose>
  ) : (
    <Link key={link.label} {...linkProps}>
      <LinkIcon className={iconStyles} />
      <p className={cn(textStyles, 'max-xl:hidden')}>{link.label}</p>
    </Link>
  );
};
