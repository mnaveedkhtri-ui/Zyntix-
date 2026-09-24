import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zyntix | Google Entity Stacking for Agencies",
  description: "Automate your high-authority link building with Zyntix. Bulk generate public, indexable DA-99 Google Docs and Sheets directly via API.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: undefined, variables: { colorPrimary: '#10b981', colorBackground: '#050B14', colorText: '#f8fafc', colorInputBackground: '#020617', colorInputText: '#f8fafc' } }}>
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-[#020617] text-slate-50 antialiased selection:bg-emerald-500/30`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
