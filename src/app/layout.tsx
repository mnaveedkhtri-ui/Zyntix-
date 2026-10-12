import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zyntix Autonomous AI Web Platform",
  description: "Autonomous multi-tenant editorial publications and high-authority organic web platform.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://zyntix-studio-ivory.vercel.app"),
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "gCz9yLEhlFt8IGLhyJZdLHR_v5PHJ7px4ot69CUB1pw",
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "bing-verification-zyntix",
    },
  },
};

const clerkPublishableKey = 
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_test_")
    ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    : "pk_live_Y2xlcmsubW9kZXJudHJlbmRzbm93Lm9yZyQ";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <html lang="en">
        <body className={`${inter.className} bg-[#faf8f5] text-stone-900 antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
