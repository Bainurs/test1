'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { scrollToElement, cn } from '@/utils/helpers';
import { NAV_LINKS, COMPANY } from '@/utils/constants';
import Button from '@/components/ui/Button';
import { MenuIcon, CloseIcon } from '@/components/icons';

/**
 * Header with dynamic color contrast:
 * - When over the dark Hero section (not scrolled) → white text (WCAG compliant)
 * - When scrolled past hero → solid white bg with dark text
 * - Smooth transition between states
 */
export default function Header() {
  const isScrolled = useScrollPosition(50);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isOverDarkBg, setIsOverDarkBg] = useState(true);

  /**
   * Detect whether the header overlaps a dark-background section.
   * We sample the background color of the element directly under the header
   * center and compute its relative luminance to decide text color.
   */
  useEffect(() => {
    const checkContrast = () => {
      if (isScrolled) {
        // Once scrolled, header has its own white background
        setIsOverDarkBg(false);
        return;
      }

      // Check the hero section's computed background
      const heroEl = document.getElementById('home');
      if (!heroEl) {
        setIsOverDarkBg(false);
        return;
      }

      const style = getComputedStyle(heroEl);
      const bg = style.backgroundColor;
      const luminance = getRelativeLuminance(bg);

      // WCAG: if background luminance < 0.179, it's "dark" → use white text
      setIsOverDarkBg(luminance < 0.179);
    };

    checkContrast();
    window.addEventListener('scroll', checkContrast, { passive: true });
    return () => window.removeEventListener('scroll', checkContrast);
  }, [isScrolled]);

  const handleNavClick = useCallback(
    (href: string) => {
      setMobileOpen(false);
      scrollToElement(href);
    },
    [],
  );

  // Determine text color mode
  const useLight = !isScrolled && isOverDarkBg;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft'
          : 'bg-transparent',
      )}
      role="banner"
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold tracking-tight transition-colors duration-300"
          aria-label={`${COMPANY.fullName} — home`}
        >
          <span className={cn(useLight ? 'text-white' : 'text-primary-500', 'transition-colors duration-300')}>
            ARMEL
          </span>
          <span className={cn(useLight ? 'text-white/70' : 'text-neutral-600', 'text-lg font-medium transition-colors duration-300')}>
            Group
          </span>
        </Link>

        {/* Desktop nav */}
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

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button
            size="sm"
            variant={useLight ? 'secondary' : 'primary'}
            onClick={() => handleNavClick('#contact')}
            className="transition-all duration-300"
          >
            Get a Quote
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className={cn(
            'inline-flex items-center justify-center rounded-lg p-2 transition-colors duration-300 md:hidden',
            useLight ? 'text-white' : 'text-neutral-700',
          )}
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white md:hidden" role="dialog" aria-modal="true">
          <ul className="flex flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className="w-full rounded-lg px-4 py-3 text-left text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-primary-500"
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li className="pt-2">
              <Button fullWidth onClick={() => handleNavClick('#contact')}>
                Get a Quote
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

/**
 * Calculate relative luminance from a CSS color string.
 * Supports rgb(), rgba(), and common formats.
 * Returns value between 0 (black) and 1 (white).
 * Used for WCAG contrast ratio calculations.
 */
function getRelativeLuminance(colorStr: string): number {
  // Parse rgb/rgba
  const match = colorStr.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (!match) return 1; // Default to light (safe fallback)

  const r = parseInt(match[1], 10) / 255;
  const g = parseInt(match[2], 10) / 255;
  const b = parseInt(match[3], 10) / 255;

  // sRGB to linear
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}
