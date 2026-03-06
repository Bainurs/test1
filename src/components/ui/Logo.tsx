import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/utils/helpers';
import { COMPANY } from '@/utils/constants';

interface LogoProps {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { width: 100, height: 36 },
  md: { width: 130, height: 46 },
  lg: { width: 160, height: 56 },
};

export default function Logo({ href = '/', size = 'md', className }: LogoProps) {
  const dims = sizeMap[size];

  const logoImage = (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-md bg-white px-2 py-1',
        className,
      )}
    >
      <Image
        src="/assets/logo.webp"
        alt={COMPANY.fullName}
        width={dims.width}
        height={dims.height}
        className="h-auto w-auto object-contain"
        priority
      />
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={`${COMPANY.fullName} — home`}>
        {logoImage}
      </Link>
    );
  }

  return logoImage;
}
