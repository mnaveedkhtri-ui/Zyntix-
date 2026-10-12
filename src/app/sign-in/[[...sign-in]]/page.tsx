import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
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

      {/* Main Sign In Box */}
      <div className="w-full flex flex-col justify-center items-center gap-6">
        <SignIn 
          appearance={{
            elements: {
              card: "shadow-xl border border-stone-200/80 rounded-2xl bg-white",
              headerTitle: "font-serif text-2xl font-normal text-stone-900",
              headerSubtitle: "font-sans text-xs text-stone-600",
              formButtonPrimary: "bg-stone-900 hover:bg-stone-800 text-stone-50 font-sans text-xs uppercase tracking-wider",
              socialButtonsBlockButton: "border border-stone-300 hover:bg-stone-50 text-stone-800 font-sans text-xs font-medium rounded-lg shadow-2xs",
              footerActionLink: "text-amber-900 hover:text-amber-950 font-medium font-sans",
            }
          }}
          routing="path" 
          path="/sign-in" 
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/studio"
        />

        <div className="text-center font-sans">
          <Link 
            href="/studio?direct=1"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-medium transition shadow-sm"
          >
            <span>Skip & Enter Studio Directly &rarr;</span>
          </Link>
          <p className="text-[11px] text-stone-400 mt-2">
            No password required for direct studio session
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-12 text-center text-xs font-sans text-stone-500">
        &copy; {new Date().getFullYear()} Zyntix Platform. Secured with Google & Clerk Authentication.
      </div>
    </div>
  );
}
