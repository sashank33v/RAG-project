"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";

type Note = {
  id: string;
  content: string;
};

type Props = {
  notes: Note[];
  loadingNotes: boolean;
};

export default function MemoryGrid({ notes, loadingNotes }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
    >
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Memory Vault</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Saved notes</h3>
          </div>
          <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">
            {notes.length} items
          </div>
        </div>

        {loadingNotes ? (
          <div className="rounded-[24px] border border-white/10 bg-[#0d1016] p-8 text-zinc-500">
            Loading notes...
          </div>
        ) : notes.length === 0 ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-[#0d1016]">
            <div className="text-center">
              <p className="text-lg font-medium text-zinc-300">No notes yet</p>
              <p className="mt-2 text-sm text-zinc-500">Add your first note above.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {notes.map((note, index) => (
              <div
                key={note.id || index}
                className="rounded-[22px] border border-white/10 bg-[#0d1016] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-[#10141c]"
              >
                <div className="mb-4 text-[11px] uppercase tracking-[0.22em] text-zinc-600">
                  Memory {index + 1}
                </div>
                <p className="text-sm leading-7 text-zinc-200">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
