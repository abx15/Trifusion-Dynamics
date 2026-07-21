import Link from "next/link";
import { ArrowRight, BrainCircuit, Layers, Smartphone, Cloud, HelpCircle } from "lucide-react";
import { ServiceItem } from "@/lib/cms-static-data";

// Helper to render icons dynamically
function ServiceIcon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case "BrainCircuit":
      return <BrainCircuit className={className} />;
    case "Layers":
      return <Layers className={className} />;
    case "Smartphone":
      return <Smartphone className={className} />;
    case "Cloud":
      return <Cloud className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
}

interface ServicesGridProps {
  services: ServiceItem[];
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <section className="py-24 bg-[#090d19] relative">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Our Expertise</h2>
            <p className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Bespoke Systems, Tailored For High-Growth Agencies
            </p>
          </div>
          <Link
            href="/services"
            className="group flex items-center gap-2 text-sm font-semibold text-primary hover:text-white transition-colors"
          >
            View All Services
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="glass-panel glass-panel-hover rounded-3xl p-8 sm:p-10 flex flex-col justify-between"
            >
              <div>
                {/* Icon Container */}
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 text-primary mb-6">
                  <ServiceIcon name={service.iconName} className="h-6 w-6" />
                </div>
                
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-4">
                  {service.name}
                </h3>
                
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  {service.description}
                </p>
                
                {/* Micro Features list */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {service.features.slice(0, 4).map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/services/${service.slug}`}
                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-primary transition-colors"
              >
                Learn More
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
