import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://metadataextractor.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Photo Metadata Extractor | View EXIF Data Instantly",
    template: "%s | Photo Metadata Extractor",
  },
  description:
    "Free browser-based tool to extract and view EXIF metadata from photos. No uploads—everything processes locally. View camera settings, GPS, timestamps, and more.",
  keywords: [
    "photo metadata viewer",
    "EXIF viewer",
    "EXIF data extractor",
    "photo metadata",
    "camera settings viewer",
    "GPS coordinates from photo",
    "image metadata",
    "photography tools",
    "extract EXIF",
    "view photo metadata",
  ],
  authors: [{ name: "Photo Metadata Extractor" }],
  creator: "Photo Metadata Extractor",
  publisher: "Photo Metadata Extractor",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Photo Metadata Extractor",
    title: "Photo Metadata Extractor | View EXIF Data Instantly",
    description:
      "Free browser-based tool to extract and view EXIF metadata from photos. No uploads—everything processes locally. View camera settings, GPS, timestamps, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Photo Metadata Extractor - View EXIF data from your photos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo Metadata Extractor | View EXIF Data Instantly",
    description:
      "Free browser-based tool to extract and view EXIF metadata from photos. No uploads—everything processes locally.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  other: {
    "ai-content-declaration": "developer",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Photo Metadata Extractor",
    description:
      "Free browser-based tool to extract and view EXIF metadata from photos. No uploads—everything processes locally.",
    url: BASE_URL,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    permissions: "browser",
    browserRequirements: "Requires JavaScript. Works in all modern browsers.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1",
    },
    features: [
      "EXIF metadata extraction",
      "GPS coordinate display",
      "Camera settings viewer",
      "Browser-based processing",
      "No server uploads required",
      "Export metadata as image",
    ],
    screenshot: `${BASE_URL}/og-image.png`,
    softwareVersion: "1.0.0",
    author: {
      "@type": "Organization",
      name: "Photo Metadata Extractor",
      url: BASE_URL,
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-neutral-900 min-h-screen">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
