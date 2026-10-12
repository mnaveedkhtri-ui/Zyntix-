export default function SignInLoading() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between items-center py-12 px-4 selection:bg-amber-100 animate-pulse">
      {/* Top Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-stone-300 rounded-md"></div>
          <div className="w-20 h-6 bg-stone-200 rounded"></div>
        </div>
        <div className="w-24 h-4 bg-stone-200 rounded"></div>
      </div>

      {/* Main Card Skeleton */}
      <div className="w-full max-w-md bg-white border border-stone-200/80 rounded-2xl p-8 shadow-xl">
        <div className="w-48 h-7 bg-stone-200 rounded mx-auto mb-3"></div>
        <div className="w-64 h-4 bg-stone-100 rounded mx-auto mb-8"></div>

        {/* Social Button Skeleton */}
        <div className="w-full h-11 bg-stone-100 border border-stone-200 rounded-lg mb-6"></div>

        {/* Divider */}
        <div className="w-full h-px bg-stone-200 mb-6"></div>

        {/* Input Skeleton */}
        <div className="w-28 h-3.5 bg-stone-200 rounded mb-2"></div>
        <div className="w-full h-10 bg-stone-100 border border-stone-200 rounded-lg mb-6"></div>

        {/* Submit Button Skeleton */}
        <div className="w-full h-11 bg-stone-800/80 rounded-lg mb-6"></div>

        {/* Footer Skeleton */}
        <div className="w-40 h-4 bg-stone-100 rounded mx-auto"></div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-12 w-64 h-4 bg-stone-200/60 rounded"></div>
    </div>
  );
}
