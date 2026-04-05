"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Upload, Brain, MessageSquare } from "lucide-react";
import clsx from "clsx";

const items = [
  { label: "Dashboard", href: "/", icon: Home },
  { label: "Notes", href: "/notes", icon: FileText },
  { label: "Uploads", href: "/uploads", icon: Upload },
  { label: "Memory", href: "/memory", icon: Brain },
  { label: "AI Chat", href: "/ai", icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden xl:flex w-[272px] flex-col border-r border-white/10 bg-[#0f1116]/90 backdrop-blur-xl">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white font-semibold text-black">
            SB
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-white">Second Brain</h1>
            <p className="text-xs text-zinc-500">Memory OS</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 px-4 py-5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              href={item.href}
              key={item.label}
              className={clsx(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200",
                isActive
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:bg-white/[0.05] hover:text-white"
              )}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-[24px] border border-white/10 bg-[#141821] p-4">
          <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
            System
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">Live</p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Notes and uploads connected.
          </p>
        </div>
      </div>
    </aside>
  );
}
