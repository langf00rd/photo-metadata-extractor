import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "photo metadata viewer for photographers",
  description: "extract and display EXIF metadata from your photos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-900 min-h-screen">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
