type Props = {
  input: string;
  setInput: (value: string) => void;
  addNote: () => void;
};

export default function QuickCapture({ input, setInput, addNote }: Props) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
            Quick Capture
          </p>
          <h3 className="mt-2 text-2xl font-semibold">Add a new note</h3>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-[#0e1118] p-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your idea, thought, plan, or insight..."
          className="min-h-[170px] w-full resize-none bg-transparent text-base text-white outline-none placeholder:text-gray-500"
        />
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex gap-2 text-xs text-gray-500">
            <span className="rounded-full border border-white/10 px-3 py-1">Idea</span>
            <span className="rounded-full border border-white/10 px-3 py-1">Memory</span>
            <span className="rounded-full border border-white/10 px-3 py-1">Draft</span>
          </div>
          <button
            onClick={addNote}
            className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-3 text-sm font-semibold shadow-lg shadow-blue-950/30 transition hover:scale-[1.02]"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
