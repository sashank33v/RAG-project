"use client";

import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { Show, UserButton } from "@clerk/nextjs";
import Button from "@/components/ui/Button";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0d10]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              Dashboard
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Premium Memory Workspace
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden min-w-[340px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-500 lg:flex">
              <Search size={16} />
              <span>Search notes, files, AI actions</span>
            </div>

            <button className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-zinc-400 transition hover:bg-white/[0.08] hover:text-white">
              <Bell size={16} />
            </button>

            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition hover:bg-white/[0.08]"
              >
                Sign in
              </Link>

              <Link
                href="/sign-up"
                className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
              >
                Sign up
              </Link>
            </Show>

            <Show when="signed-in">
              <Button variant="secondary">Command</Button>
              <UserButton afterSignOutUrl="/" />
            </Show>
          </div>
        </div>
      </div>
    </header>
  );
}
