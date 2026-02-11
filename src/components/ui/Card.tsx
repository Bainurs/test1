import { HTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  hover = false,
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white shadow-soft',
        paddingClasses[padding],
        hover && 'transition-shadow duration-300 hover:shadow-card',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
