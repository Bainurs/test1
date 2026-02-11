import { SERVICES } from '@/utils/constants';
import Card from '@/components/ui/Card';
import SectionHeading from '@/components/ui/SectionHeading';
import { getServiceIcon } from '@/components/icons';

export default function Services() {
  return (
    <section id="services" className="bg-neutral-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Our Services"
          subtitle="Comprehensive solutions tailored to meet the unique needs of each industry and client."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = getServiceIcon(service.icon);
            return (
              <Card key={service.id} hover className="group">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-500 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-neutral-900">{service.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-600">{service.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
