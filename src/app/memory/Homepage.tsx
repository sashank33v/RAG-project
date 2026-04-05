"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

const mockResults = [
  {
    title: "Startup pitch ideas",
    source: "Notes",
    preview: "AI productivity app for founders with memory retrieval and premium workspace...",
  },
  {
    title: "Research.pdf",
    source: "Uploads",
    preview: "Document discusses knowledge systems, retrieval pipelines, embeddings, and semantic search...",
  },
  {
    title: "Meeting note",
    source: "Notes",
    preview: "Need to improve dashboard polish, connect uploads to AI, and design better search experience...",
  },
];

export default function MemoryPage() {
  const [query, setQuery] = useState("");

  const filteredResults = mockResults.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.preview.toLowerCase().includes(query.toLowerCase()) ||
    item.source.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#0b0d10] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />

        <section className="flex-1">
          <Topbar />

          <div className="px-6 py-8 lg:px-8">
            <div className="mx-auto max-w-[1400px]">
              <div className="mb-8">
                <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                  Memory
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  Search your second brain
                </h1>
              </div>

              <section className="rounded-[28px] border border-white/10 bg-[#111318] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <div className="rounded-[24px] border border-white/10 bg-[#0d1016] p-4">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search notes, files, ideas, memory..."
                    className="w-full bg-transparent text-base text-white outline-none placeholder:text-zinc-600"
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {["All", "Notes", "Uploads", "Ideas", "Recent"].map((tag) => (
                    <button
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </section>

              <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
                <div className="rounded-[28px] border border-white/10 bg-[#111318] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                        Results
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">
                        Memory matches
                      </h2>
                    </div>

                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">
                      {filteredResults.length} items
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredResults.length === 0 ? (
                      <div className="rounded-[22px] border border-dashed border-white/10 bg-[#0d1016] p-10 text-center text-zinc-500">
                        No memory results found.
                      </div>
                    ) : (
                      filteredResults.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-[22px] border border-white/10 bg-[#0d1016] p-5 transition hover:border-white/20 hover:bg-[#10141c]"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-medium text-white">
                              {item.title}
                            </p>
                            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">
                              {item.source}
                            </span>
                          </div>
                          <p className="text-sm leading-7 text-zinc-400">
                            {item.preview}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <aside className="rounded-[28px] border border-white/10 bg-[#111318] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                    AI Summary
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    Retrieval Overview
                  </h3>

                  <div className="mt-5 rounded-[22px] border border-white/10 bg-[#0d1016] p-4">
                    <p className="text-sm leading-7 text-zinc-400">
                      This panel will later show AI-generated answers from your notes and uploaded files.
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-[#0d1016] p-4 text-sm text-zinc-300">
                      Semantic search
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#0d1016] p-4 text-sm text-zinc-300">
                      Source linking
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#0d1016] p-4 text-sm text-zinc-300">
                      RAG answers
                    </div>
                  </div>
                </aside>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
