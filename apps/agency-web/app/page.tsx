import Hero from "@/components/sections/Hero";
import ServicesGrid from "@/components/sections/ServicesGrid";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import TestimonialCarousel from "@/components/sections/TestimonialCarousel";
import BlogPreview from "@/components/sections/BlogPreview";
import CTASection from "@/components/sections/CTASection";

import {
  getCmsServices,
  getPortfolioItems,
  getBlogPosts,
  getTestimonials,
} from "@/lib/api";

// Incremental Static Regeneration configuration
export const revalidate = 60;

export default async function Home() {
  // Concurrent fetching of CMS and stub resources
  const [services, portfolioItems, blogPosts, testimonials] = await Promise.all([
    getCmsServices(),
    getPortfolioItems(),
    getBlogPosts(),
    getTestimonials(),
  ]);

  return (
    <div className="flex flex-col w-full">
      <Hero />
      <ServicesGrid services={services} />
      <PortfolioGrid items={portfolioItems} />
      <TestimonialCarousel testimonials={testimonials} />
      <BlogPreview posts={blogPosts} />
      <CTASection />
    </div>
  );
}
