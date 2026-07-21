"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Case Studies" },
  { href: "/blog", label: "Insights" },
  { href: "/about", label: "About Us" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#070a13]/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary font-display font-extrabold text-black text-xl shadow-lg shadow-primary/20">
            T
          </div>
          <span className="font-display font-bold tracking-tight text-white text-xl">
            Trifusion<span className="text-primary font-normal">Dynamics</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href) ? "text-primary font-semibold" : "text-slate-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Call to Action */}
        <div className="hidden md:flex items-center">
          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-black transition-all hover:scale-102 active:scale-98"
          >
            Book Consultation
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white hover:bg-white/5 md:hidden"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-x-0 top-20 bottom-0 z-40 bg-[#070a13]/95 backdrop-blur-lg md:hidden">
          <div className="flex flex-col gap-6 p-8 border-t border-white/5 h-full">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium transition-colors border-b border-white/5 pb-2 ${
                  isActive(link.href) ? "text-primary font-semibold" : "text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary py-3.5 text-center font-semibold text-black"
            >
              Book Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
