type Props = {
  notesCount: number;
};

export default function HeroSection({ notesCount }: Props) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/6 p-8 backdrop-blur-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-violet-500/10" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-200">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            AI Memory System Active
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Build a second brain that feels like a funded product.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-300 md:text-base">
            Capture notes, retrieve memories, and evolve this into a premium AI workspace.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Notes</p>
          <p className="mt-3 text-3xl font-semibold">{notesCount}</p>
          <p className="mt-2 text-sm text-gray-400">Saved memory blocks</p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Mode</p>
          <p className="mt-3 text-3xl font-semibold">MVP</p>
          <p className="mt-2 text-sm text-gray-400">Startup-style build phase</p>
        </div>
      </div>
    </section>
  );
}
