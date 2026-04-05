export default function Sidebar() {
  const navItems = [
    { name: "Dashboard", icon: "◉" },
    { name: "Memory", icon: "◎" },
    { name: "Workspace", icon: "✦" },
    { name: "Collections", icon: "◌" },
  ];

  return (
    <aside className="hidden w-72 border-r border-white/10 bg-white/5 backdrop-blur-2xl xl:flex xl:flex-col">
      <div className="border-b border-white/10 px-8 py-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-900/40">
            ✦
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-wide">Second Brain</h1>
            <p className="text-xs text-gray-400">Premium Intelligence OS</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-6">
        <div className="mb-3 px-3 text-xs uppercase tracking-[0.25em] text-gray-500">
          Navigation
        </div>
        <div className="space-y-2">
          {navItems.map((item, index) => (
            <button
              key={item.name}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition duration-200 ${
                index === 0
                  ? "border border-blue-400/20 bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-white shadow-lg shadow-blue-950/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-sm opacity-80">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-5">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.22em] text-blue-300/80">
            System Status
          </p>
          <p className="mt-3 text-2xl font-semibold">Live MVP</p>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            Today: notes, save flow, premium shell.
          </p>
        </div>
      </div>
    </aside>
  );
}
