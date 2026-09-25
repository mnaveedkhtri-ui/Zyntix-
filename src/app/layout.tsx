import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zyntix | Google Entity Stacking for Agencies",
  description: "Automate your high-authority link building with Zyntix. Bulk generate public, indexable DA-99 Google Docs and Sheets directly via API.",
  verification: {
    google: "XKqDOIporTLwhEyizWES5BzLGewgVKX3ymxqUbKwjvE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-[#020617] text-slate-50 antialiased selection:bg-emerald-500/30`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
