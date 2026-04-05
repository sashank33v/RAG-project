export default function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07090f]/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-blue-300/80">
            Dashboard
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            Cognitive Workspace
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-400 md:flex md:min-w-[320px]">
            Search memories, notes, AI actions...
          </div>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 transition hover:bg-white/10">
            Command
          </button>
          <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-3 text-sm font-semibold shadow-xl shadow-violet-950/30 transition hover:scale-[1.02]">
            New Memory
          </button>
        </div>
      </div>
    </header>
  );
}
