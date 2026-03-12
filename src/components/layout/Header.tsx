'use client';

import { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { scrollToElement, cn } from '@/utils/helpers';
import { NAV_LINKS } from '@/utils/constants';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import { MenuIcon, CloseIcon } from '@/components/icons';

export default function Header() {
  const isScrolled = useScrollPosition(50);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isOverDarkBg, setIsOverDarkBg] = useState(true);

  useEffect(() => {
    const check = () => {
      if (isScrolled) {
        setIsOverDarkBg(false);
        return;
      }
      const darkSection = document.querySelector('[data-dark-hero]') as HTMLElement | null;
      if (!darkSection) {
        setIsOverDarkBg(false);
        return;
      }
      const rect = darkSection.getBoundingClientRect();
      setIsOverDarkBg(rect.bottom > 0);
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [isScrolled]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const pathname = usePathname();
  const isHome = pathname === '/';

  const handleNavClick = useCallback(
    (href: string) => {
      setMobileOpen(false);
      if (isHome) {
        scrollToElement(href);
      } else {
        window.location.href = `/${href}`;
      }
    },
    [isHome],
  );

  const useLight = !isScrolled && isOverDarkBg && !mobileOpen;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled || mobileOpen
            ? 'bg-neutral-100/95 backdrop-blur-md shadow-soft'
            : 'bg-transparent',
        )}
        role="banner"
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <Logo size="sm" className={cn('transition-colors duration-300', useLight ? 'bg-transparent' : 'bg-neutral-100/95')} />

          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    'text-sm font-medium transition-colors duration-300 hover:opacity-80',
                    useLight ? 'text-white/90 hover:text-white' : 'text-neutral-700 hover:text-primary-500',
                  )}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            {isHome ? (
              <Button
                size="sm"
                variant={useLight ? 'secondary' : 'primary'}
                onClick={() => handleNavClick('#contact')}
                className="transition-all duration-300"
              >
                Contact Us
              </Button>
            ) : (
              <Link href="/#contact">
                <Button
                  size="sm"
                  variant={useLight ? 'secondary' : 'primary'}
                  className="transition-all duration-300"
                >
                  Contact Us
                </Button>
              </Link>
            )}
          </div>

          <button
            className={cn(
              'relative z-50 inline-flex items-center justify-center rounded-lg p-2 transition-colors duration-300 md:hidden',
              useLight ? 'text-white' : 'text-neutral-700',
            )}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </nav>

        {/* Mobile menu with slide animation */}
        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-300 ease-in-out md:hidden',
            mobileOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="overflow-hidden">
            <div className="border-t border-neutral-200 bg-white px-4 py-4">
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <li
                    key={link.href}
                    className={cn(
                      'transition-all duration-300',
                      mobileOpen
                        ? 'translate-y-0 opacity-100'
                        : '-translate-y-2 opacity-0',
                    )}
                    style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : '0ms' }}
                  >
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className="w-full rounded-lg px-4 py-3 text-left text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-primary-500"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
                <li
                  className={cn(
                    'pt-2 transition-all duration-300',
                    mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
                  )}
                  style={{ transitionDelay: mobileOpen ? `${NAV_LINKS.length * 50}ms` : '0ms' }}
                >
                  {isHome ? (
                    <Button fullWidth onClick={() => handleNavClick('#contact')}>
                      Contact Us
                    </Button>
                  ) : (
                    <Link href="/#contact">
                      <Button fullWidth>
                        Contact Us
                      </Button>
                    </Link>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay — blocks content interaction when menu is open */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
