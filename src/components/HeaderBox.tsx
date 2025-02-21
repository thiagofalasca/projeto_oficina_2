import { cn } from '@/lib/utils';
import React from 'react';

interface HeaderBoxProps {
  title: string;
  subText?: string;
  userName?: string | null;
  className?: string;
}

const HeaderBox = ({ title, subText, userName, className }: HeaderBoxProps) => {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 text-center text-4xl text-blue-600',
        className
      )}
    >
      <h1 className="font-semibold">
        {title}
        {userName && <span className="text-blue-600"> {userName}</span>}
      </h1>
      {subText && <p className="text-base text-gray-600">{subText}</p>}
    </header>
  );
};

export default HeaderBox;
