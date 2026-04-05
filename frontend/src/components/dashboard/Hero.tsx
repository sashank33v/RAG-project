"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type Props = {
  notesCount: number;
};

export default function Hero({ notesCount }: Props) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-8 md:p-10">
          <p className="text-sm text-zinc-500">Intelligence workspace</p>

          <h1 className="mt-4 max-w-3xl text-4xl md:text-5xl font-semibold leading-[1.02] tracking-tight text-white">
            Capture everything. Retrieve anything. Think faster.
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-zinc-400">
            Your premium second-brain system for notes, files, memory retrieval, and AI-powered workflows.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button>Open Workspace</Button>
            <Button variant="secondary">Explore Notes</Button>
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-4">
        <Card className="p-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Total Notes</p>
          <p className="mt-4 text-4xl font-semibold text-white">{notesCount}</p>
        </Card>

        <Card className="p-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Stage</p>
          <p className="mt-4 text-2xl font-semibold text-white">MVP+</p>
        </Card>

        <Card className="p-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Next</p>
          <p className="mt-4 text-lg font-medium text-zinc-200">RAG + AI chat</p>
        </Card>
      </div>
    </section>
  );
}
