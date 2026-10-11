import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zyntix Autonomous AI Web Platform",
  description: "Autonomous multi-tenant editorial publications and high-authority organic web platform.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://zyntix-studio-ivory.vercel.app"),
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google-site-verification-zyntix-auto",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "bing-verification-zyntix",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#faf8f5] text-stone-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
