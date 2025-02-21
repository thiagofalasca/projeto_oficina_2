import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface AppLogoProps {
  type?: 'mobile' | 'desktop';
}

export default function AppLogo({ type = 'desktop' }: AppLogoProps) {
  return (
    <Link
      href="/workshops"
      className={cn('mobile-app-logo', { 'app-logo': type === 'desktop' })}
    >
      <Image
        src="/logo.svg"
        width={35}
        height={35}
        alt="Logo"
        className="size-8"
      />
      <h1 className={cn('app-name', { 'max-xl:hidden': type === 'desktop' })}>
        AppName
      </h1>
    </Link>
  );
}
