import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zyntix Autonomous AI Web Platform",
  description: "Autonomous multi-tenant editorial publications and high-authority organic web platform.",
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
