"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

type Note = {
  id: number;
  content: string;
  created_at?: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function NotesPage() {
  const { getToken, isLoaded, userId } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      setLoading(true);

      const token = await getToken();
      const res = await axios.get(`${API}/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotes(res.data);

      if (res.data.length > 0) {
        setSelectedNote(res.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      setLoading(false);
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
                  Notes
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  My Notes
                </h1>
              </div>

              <div className="grid gap-6 xl:grid-cols-[320px_1fr_320px]">
                <section className="rounded-[28px] border border-white/10 bg-[#111318] p-4">
                  <div className="mb-4 rounded-2xl border border-white/10 bg-[#0d1016] px-4 py-3 text-sm text-zinc-500">
                    Search notes...
                  </div>

                  <div className="space-y-3">
                    {loading ? (
                      <div className="text-zinc-500">Loading...</div>
                    ) : notes.length === 0 ? (
                      <div className="text-zinc-500">No notes found.</div>
                    ) : (
                      notes.map((note) => (
                        <button
                          key={note.id}
                          onClick={() => setSelectedNote(note)}
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            selectedNote?.id === note.id
                              ? "border-white/20 bg-white/[0.06]"
                              : "border-white/10 bg-[#0d1016] hover:border-white/20 hover:bg-[#10141c]"
                          }`}
                        >
                          <p className="text-sm font-medium text-white">
                            Note #{note.id}
                          </p>
                          <p className="mt-2 line-clamp-2 text-xs leading-6 text-zinc-500">
                            {note.content}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </section>

                <section className="rounded-[28px] border border-white/10 bg-[#111318] p-6">
                  {selectedNote ? (
                    <div className="rounded-[24px] border border-white/10 bg-[#0d1016] p-6">
                      <p className="text-sm leading-8 text-zinc-200">
                        {selectedNote.content}
                      </p>
                    </div>
                  ) : (
                    <div className="text-zinc-500">Select a note.</div>
                  )}
                </section>

                <section className="rounded-[28px] border border-white/10 bg-[#111318] p-5">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                    AI Copilot
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    Note Actions
                  </h3>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
