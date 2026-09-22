import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zyntix | Automated Agency Backlink Engine",
  description: "Automate your high-authority link building with our Instant Turbo Engine. 100% natural, geo-targeted Web 2.0, Forums, and Profile backlinks for SEO Agencies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased selection:bg-blue-500/30`}>
        {children}
      </body>
    </html>
  );
}


