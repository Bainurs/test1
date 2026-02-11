'use client';

import { useState, useEffect } from 'react';

/**
 * Returns the current vertical scroll position.
 * Useful for sticky header styling.
 */
export function useScrollPosition(threshold = 0): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
}
