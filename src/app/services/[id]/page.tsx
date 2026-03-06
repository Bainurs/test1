import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { SERVICES, SERVICE_PAGES, COMPANY } from '@/utils/constants';
import { getServiceIcon } from '@/components/icons';
import { CheckCircleIcon } from '@/components/icons';

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return SERVICES.map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const page = SERVICE_PAGES[params.id];
  if (!page) return {};

  return {
    title: page.pageTitle,
    description: page.intro.substring(0, 160),
    openGraph: {
      title: `${page.pageTitle} | ${COMPANY.fullName}`,
      description: page.intro.substring(0, 160),
    },
  };
}

export default function ServicePage({ params }: PageProps) {
  const service = SERVICES.find((s) => s.id === params.id);
  const page = SERVICE_PAGES[params.id];

  if (!service || !page) {
    notFound();
  }

  const Icon = getServiceIcon(service.icon);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-200">
        {/* Hero banner */}
        <section data-dark-hero className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 pt-32 pb-20">
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary-400/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-accent-500/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
            <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Icon size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {page.pageTitle}
            </h1>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
          <Link
            href="/#services"
            className="mb-10 inline-flex items-center gap-1 text-sm font-medium text-primary-500 transition-colors hover:text-primary-700"
          >
            &larr; All Services
          </Link>

          <p className="text-lg leading-relaxed text-neutral-800">
            {page.intro}
          </p>

          <h2 className="mt-12 text-2xl font-bold text-neutral-900">What We Provide</h2>

          <ul className="mt-6 space-y-4">
            {page.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-primary-500">
                  <CheckCircleIcon size={20} />
                </span>
                <span className="text-neutral-800">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-16 rounded-2xl bg-white p-8 text-center shadow-soft">
            <p className="text-xl font-bold text-neutral-900 italic">
              &ldquo;{page.closing}&rdquo;
            </p>
          </div>

          <div className="mt-12 text-center">
            <Link href="/#contact">
              <Button size="lg">Contact Us</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
