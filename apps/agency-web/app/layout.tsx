import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Trifusion Dynamics | Full-Stack & AI-Powered SaaS Development",
    template: "%s | Trifusion Dynamics",
  },
  description:
    "We build modern, resilient full-stack applications and integrate bespoke AI automations to transform operations for Indian SMBs and startups.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://trifusiondynamics.com"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Trifusion Dynamics",
    "url": "https://trifusiondynamics.com",
    "logo": "https://trifusiondynamics.com/logo.png",
    "description": "Premium Full-Stack and AI-powered SaaS agency targeting high-growth startups and enterprises.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-98765-43210",
      "contactType": "sales",
      "email": "trifusiondynamics@gmail.com",
      "areaServed": "IN",
      "availableLanguage": "en"
    },
    "sameAs": [
      "https://twitter.com/trifusion",
      "https://linkedin.com/company/trifusion-dynamics"
    ]
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#070a13] text-slate-100 font-sans">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
