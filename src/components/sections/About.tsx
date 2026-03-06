import SectionHeading from '@/components/ui/SectionHeading';

export default function About() {
  return (
    <section id="about" className="bg-neutral-200 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="About ARMEL Group"
          subtitle="A diversified international company committed to excellence, innovation, and sustainable growth."
        />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column */}
          <div className="space-y-6 text-neutral-700">
            <p className="text-lg leading-relaxed">
              Founded with a vision to bridge industries across continents, ARMEL Group has grown
              into a trusted partner for businesses, governments, and communities worldwide. We
              combine deep industry expertise with cutting-edge technology to deliver results that
              matter.
            </p>
            <p className="leading-relaxed">
              From managing complex global supply chains to deploying enterprise IT solutions, our
              multidisciplinary teams work seamlessly to solve the most demanding challenges. We
              are not just service providers — we are strategic partners invested in the long-term
              success of every client.
            </p>
          </div>

          {/* Right column — key figures */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: '8+', label: 'Countries Served' },
              { value: '70+', label: 'Projects Delivered' },
              { value: '98%', label: 'Client Satisfaction' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-soft"
              >
                <span className="text-3xl font-extrabold text-primary-500 sm:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-2 text-sm font-medium text-neutral-600">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
