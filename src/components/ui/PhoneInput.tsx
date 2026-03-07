'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/utils/helpers';

interface Country {
  code: string;
  name: string;
  dial: string;
  mask: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States',  dial: '+1',   mask: '(###) ###-####',      flag: '🇺🇸' },
  { code: 'CA', name: 'Canada',         dial: '+1',   mask: '(###) ###-####',      flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', dial: '+44',  mask: '#### ######',         flag: '🇬🇧' },
  { code: 'DE', name: 'Germany',        dial: '+49',  mask: '### ########',        flag: '🇩🇪' },
  { code: 'FR', name: 'France',         dial: '+33',  mask: '# ## ## ## ##',       flag: '🇫🇷' },
  { code: 'AU', name: 'Australia',      dial: '+61',  mask: '### ### ###',         flag: '🇦🇺' },
  { code: 'JP', name: 'Japan',          dial: '+81',  mask: '##-####-####',        flag: '🇯🇵' },
  { code: 'IN', name: 'India',          dial: '+91',  mask: '##### #####',         flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil',         dial: '+55',  mask: '(##) #####-####',     flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico',         dial: '+52',  mask: '## #### ####',        flag: '🇲🇽' },
  { code: 'KR', name: 'South Korea',    dial: '+82',  mask: '##-####-####',        flag: '🇰🇷' },
  { code: 'IT', name: 'Italy',          dial: '+39',  mask: '### ### ####',        flag: '🇮🇹' },
  { code: 'ES', name: 'Spain',          dial: '+34',  mask: '### ### ###',         flag: '🇪🇸' },
  { code: 'RU', name: 'Russia',         dial: '+7',   mask: '(###) ###-##-##',     flag: '🇷🇺' },
  { code: 'UA', name: 'Ukraine',        dial: '+380', mask: '(##) ###-##-##',      flag: '🇺🇦' },
  { code: 'AE', name: 'UAE',            dial: '+971', mask: '## ### ####',         flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia',   dial: '+966', mask: '## ### ####',         flag: '🇸🇦' },
  { code: 'IL', name: 'Israel',         dial: '+972', mask: '##-###-####',         flag: '🇮🇱' },
  { code: 'TR', name: 'Turkey',         dial: '+90',  mask: '### ### ## ##',       flag: '🇹🇷' },
  { code: 'CN', name: 'China',          dial: '+86',  mask: '### #### ####',       flag: '🇨🇳' },
];

function applyMask(value: string, mask: string): string {
  const digits = value.replace(/\D/g, '');
  let result = '';
  let dIdx = 0;

  for (let i = 0; i < mask.length && dIdx < digits.length; i++) {
    if (mask[i] === '#') {
      result += digits[dIdx++];
    } else {
      result += mask[i];
    }
  }

  return result;
}

function getMaxDigits(mask: string): number {
  return (mask.match(/#/g) || []).length;
}

interface PhoneInputProps {
  label?: string;
  value: string;
  onChange: (fullValue: string) => void;
  error?: string | null;
  id?: string;
}

export default function PhoneInput({ label, value, onChange, error, id }: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputId = id || 'phone';

  const localNumber = value.startsWith(country.dial)
    ? value.slice(country.dial.length).trim()
    : value.replace(/^[+\d\s]+/, '').length < value.length
      ? ''
      : value;

  const maskedLocal = applyMask(localNumber, country.mask);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digits = raw.replace(/\D/g, '');
      const maxDigits = getMaxDigits(country.mask);
      const trimmed = digits.slice(0, maxDigits);
      const masked = applyMask(trimmed, country.mask);
      onChange(`${country.dial} ${masked}`);
    },
    [country, onChange],
  );

  const handleCountrySelect = useCallback(
    (c: Country) => {
      setCountry(c);
      setOpen(false);
      onChange(`${c.dial} `);
    },
    [onChange],
  );

  const handleBlur = useCallback((e: React.FocusEvent) => {
    setTimeout(() => {
      if (dropdownRef.current && !dropdownRef.current.contains(document.activeElement)) {
        setOpen(false);
      }
    }, 150);
  }, []);

  return (
    <div className="flex flex-col gap-1.5" ref={dropdownRef} onBlur={handleBlur}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}

      <div className="relative flex">
        {/* Country selector */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            'flex shrink-0 items-center gap-1 rounded-l-lg border border-r-0 border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm transition-colors hover:bg-neutral-100',
            error && 'border-red-500',
          )}
          aria-label="Select country"
        >
          <span className="text-lg leading-none">{country.flag}</span>
          <span className="text-neutral-700">{country.dial}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5 text-neutral-400">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Phone number input */}
        <input
          id={inputId}
          type="tel"
          value={maskedLocal}
          onChange={handleInputChange}
          placeholder={country.mask.replace(/#/g, '0')}
          className={cn(
            'w-full rounded-r-lg border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 transition-colors duration-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />

        {/* Dropdown */}
        {open && (
          <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-72 overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-card">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleCountrySelect(c)}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-neutral-50',
                  c.code === country.code && 'bg-primary-50 text-primary-600',
                )}
              >
                <span className="text-lg leading-none">{c.flag}</span>
                <span className="font-medium">{c.name}</span>
                <span className="ml-auto text-neutral-400">{c.dial}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
