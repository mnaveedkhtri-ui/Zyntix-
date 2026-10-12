import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between items-center py-12 px-4 selection:bg-amber-100">
      {/* Top Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-stone-900 text-stone-50 rounded-md flex items-center justify-center font-serif font-bold text-sm">
            Z
          </div>
          <span className="font-serif text-2xl font-normal text-stone-900">Zyntix</span>
        </Link>
        <Link href="/" className="font-sans text-xs uppercase tracking-wider text-stone-600 hover:text-stone-950">
          &larr; Back to Home
        </Link>
      </div>

      {/* Main Sign Up Box */}
      <div className="w-full flex justify-center items-center">
        <SignUp 
          appearance={{
            elements: {
              card: "shadow-xl border border-stone-200/80 rounded-2xl bg-white",
              headerTitle: "font-serif text-2xl font-normal text-stone-900",
              headerSubtitle: "font-sans text-xs text-stone-600",
              formButtonPrimary: "bg-stone-900 hover:bg-stone-800 text-stone-50 font-sans text-xs uppercase tracking-wider",
              socialButtonsBlockButton: "hidden",
              socialButtons: "hidden",
              dividerRow: "hidden",
              footerActionLink: "text-amber-900 hover:text-amber-950 font-medium font-sans",
            }
          }}
          routing="path" 
          path="/sign-up" 
          signInUrl="/sign-in"
          fallbackRedirectUrl="/studio"
        />
      </div>

      {/* Bottom Footer */}
      <div className="mt-12 text-center text-xs font-sans text-stone-500">
        &copy; {new Date().getFullYear()} Zyntix Platform. Secured with Google & Clerk Authentication.
      </div>
    </div>
  );
}
