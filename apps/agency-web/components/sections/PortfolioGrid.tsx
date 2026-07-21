import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PortfolioItem } from "@/lib/cms-static-data";

interface PortfolioGridProps {
  items: PortfolioItem[];
}

export default function PortfolioGrid({ items }: PortfolioGridProps) {
  return (
    <section className="py-24 bg-[#070a13] relative">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Case Studies</h2>
            <p className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Real Impact, Proven Technology
            </p>
          </div>
          <Link
            href="/portfolio"
            className="group flex items-center gap-2 text-sm font-semibold text-primary hover:text-white transition-colors"
          >
            View All Work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.slice(0, 3).map((item) => (
            <Link
              key={item.id}
              href={`/portfolio/${item.slug}`}
              className="group flex flex-col h-full rounded-3xl bg-[#0f172a]/45 border border-white/5 overflow-hidden transition-all hover:-translate-y-1 hover:border-primary/20 hover:bg-[#0f172a]/80"
            >
              {/* Image Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  sizes="(max-w-768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070a13] via-transparent to-transparent opacity-80" />
                <span className="absolute top-4 left-4 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-semibold text-primary border border-white/5">
                  {item.category}
                </span>
              </div>

              {/* Text Info */}
              <div className="flex-1 flex flex-col justify-between p-6">
                <div>
                  <p className="text-[11px] font-mono text-slate-500 mb-2">
                    {item.client} • {item.year}
                  </p>
                  <h3 className="text-lg font-bold text-white mb-2.5 leading-snug group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-6">
                    {item.summary}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 group-hover:text-primary transition-colors">
                  Read Case Study
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
