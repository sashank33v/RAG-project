type Note = {
  id: string;
  content: string;
};

type Props = {
  notes: Note[];
};

export default function NotesGrid({ notes }: Props) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
            Memory Vault
          </p>
          <h3 className="mt-2 text-2xl font-semibold">Saved notes</h3>
        </div>
        <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400">
          {notes.length} total
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-[#0e1118] text-center">
          <div>
            <p className="text-lg font-medium text-gray-300">No memories yet</p>
            <p className="mt-2 text-sm text-gray-500">
              Add your first note to start building the system.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid max-h-[480px] gap-4 overflow-y-auto pr-1 md:grid-cols-2">
          {notes.map((note, index) => (
            <div
              key={note.id || index}
              className="rounded-[24px] border border-white/10 bg-[#0f131c] p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-[#121826]"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-gray-400">
                  Note
                </span>
                <span className="text-xs text-gray-500">Memory #{index + 1}</span>
              </div>
              <p className="text-sm leading-7 text-gray-200">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
