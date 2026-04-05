
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

type Note = {
  id: number;
  content: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function HomePage() {
  const { getToken, isLoaded, userId } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);

  const fetchNotes = async () => {
    try {
      setLoadingNotes(true);

      const token = await getToken();
      const res = await axios.get(`${API}/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotes(res.data);
    } catch (error) {
      console.error("Notes fetch failed:", error);
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      setLoadingNotes(false);
      return;
    }
    fetchNotes();
  }, [isLoaded, userId]);

  return (
    <main className="min-h-screen bg-[#0b0d10] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />
        <section className="flex-1">
          <Topbar />
          <div className="p-6 lg:p-8">
            <div className="mx-auto max-w-[1500px]">
              <div className="mb-8">
                <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                  Dashboard
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  Premium Memory Workspace
                </h1>
              </div>

              <section className="rounded-[28px] border border-white/10 bg-[#111318] p-6">
                <h2 className="text-xl font-semibold">Recent Notes</h2>

                <div className="mt-6 space-y-3">
                  {loadingNotes ? (
                    <div className="text-zinc-500">Loading notes...</div>
                  ) : notes.length === 0 ? (
                    <div className="text-zinc-500">No notes found.</div>
                  ) : (
                    notes.slice(0, 5).map((note) => (
                      <div
                        key={note.id}
                        className="rounded-2xl border border-white/10 bg-[#0d1016] p-4"
                      >
                        <p className="text-sm font-medium text-white">
                          Note #{note.id}
                        </p>
                        <p className="mt-2 text-sm text-zinc-400">
                          {note.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
