import Link from 'next/link';
import { SERVICES } from '@/utils/constants';
import Card from '@/components/ui/Card';
import SectionHeading from '@/components/ui/SectionHeading';
import { getServiceIcon } from '@/components/icons';

export default function Services() {
  return (
    <section id="services" className="bg-neutral-100 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Our Services"
          subtitle="Comprehensive solutions tailored to meet the unique needs of each industry and client."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = getServiceIcon(service.icon);
            return (
              <Link key={service.id} href={`/services/${service.id}`}>
                <Card hover className="group h-full">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-500 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                    <Icon size={24} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-neutral-900 transition-colors group-hover:text-primary-500">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-700">{service.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-500 opacity-0 transition-opacity group-hover:opacity-100">
                    Learn more &rarr;
                  </span>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
