"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type Props = {
  input: string;
  setInput: (value: string) => void;
  addNote: () => void;
  savingNote: boolean;
};

export default function QuickCapture({
  input,
  setInput,
  addNote,
  savingNote,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
    >
      <Card className="p-6">
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Quick Capture</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Write a note</h3>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[#0d1016] p-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write your idea, plan, research note..."
            className="min-h-[220px] w-full resize-none bg-transparent text-[15px] leading-7 text-white outline-none placeholder:text-zinc-600"
          />

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <div className="flex gap-2">
              {["Idea", "Memory", "Draft"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500"
                >
                  {tag}
                </span>
              ))}
            </div>

            <Button onClick={addNote}>
              {savingNote ? "Saving..." : "Save Note"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
