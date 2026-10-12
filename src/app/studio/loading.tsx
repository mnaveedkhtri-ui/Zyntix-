export default function StudioLoading() {
  return (
    <div className="h-screen w-screen bg-[#121214] text-zinc-100 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-12 h-12 rounded-xl bg-stone-100 text-zinc-950 flex items-center justify-center font-serif font-bold text-xl mb-4 animate-pulse shadow-lg">
        Z
      </div>
      <p className="font-serif text-lg text-stone-200">Loading Zyntix Studio...</p>
      <p className="text-zinc-500 text-xs mt-1 font-sans">Connecting to autonomous workspace</p>
    </div>
  );
}
