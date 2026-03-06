'use client';

import Button from '@/components/ui/Button';
import { COMPANY } from '@/utils/constants';

export default function Hero() {
  return (
    <section
      id="home"
      data-dark-hero
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800"
    >
      {/* Abstract decorative shapes */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-primary-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-accent-500/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-white/5 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent-400">
            Global Solutions &middot; Local Expertise
          </p>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {COMPANY.tagline}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-100/90">
            {COMPANY.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact Us
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 hover:text-white"
              onClick={() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Our Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
