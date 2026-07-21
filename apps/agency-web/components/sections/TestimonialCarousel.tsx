import Image from "next/image";
import { Quote } from "lucide-react";
import { Testimonial } from "@/lib/cms-static-data";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function TestimonialCarousel({ testimonials }: TestimonialsProps) {
  return (
    <section className="py-24 bg-[#090d19] relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 h-[250px] w-[250px] rounded-full bg-secondary/5 blur-[90px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 relative">
        {/* Section Header */}
        <div className="max-w-3xl text-center mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Testimonials</h2>
          <p className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Loved By Growing Startups & SMBs
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="glass-panel rounded-3xl p-8 sm:p-10 relative flex flex-col justify-between"
            >
              <Quote className="absolute top-6 right-8 h-10 w-10 text-white/5 pointer-events-none" />
              
              <div>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic mb-8 relative z-10">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-slate-900 border border-white/10">
                  <Image
                    src={test.avatar}
                    alt={test.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    {test.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {test.role}, <span className="text-primary">{test.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
