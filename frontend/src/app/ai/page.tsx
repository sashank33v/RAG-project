"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type DocumentItem = {
  filename: string;
  path?: string;
  text?: string;
};

const API = "http://localhost:8000";

export default function AIPage() {
  const [input, setInput] = useState("");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to your AI workspace. Ask about uploaded files and I’ll answer from them.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(`${API}/documents`);
      setDocuments(res.data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/ask`, { question: userText });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.answer || "No answer received." },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: error?.response?.data?.detail || "AI request failed" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0d10] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />
        <section className="flex-1">
          <Topbar />
          <div className="px-6 py-8 lg:px-8">
            <div className="mx-auto max-w-[1400px]">
              <div className="mb-8">
                <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">AI Workspace</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Ask your second brain</h1>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
                <section className="rounded-[28px] border border-white/10 bg-[#111318] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Conversation</p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">AI Chat</h2>
                    </div>
                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">
                      {documents.length} docs
                    </div>
                  </div>

                  <div className="min-h-[480px] space-y-4 rounded-[24px] border border-white/10 bg-[#0d1016] p-5">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-7 ${
                          message.role === "user"
                            ? "ml-auto bg-white text-black"
                            : "border border-white/10 bg-[#151922] text-zinc-200"
                        }`}
                      >
                        {message.content}
                      </div>
                    ))}
                    {loading && (
                      <div className="max-w-[80%] rounded-2xl border border-white/10 bg-[#151922] px-4 py-3 text-sm text-zinc-400">
                        Thinking...
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex gap-3">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                      }}
                      placeholder="Ask AI about uploaded files..."
                      className="flex-1 rounded-2xl border border-white/10 bg-[#0d1016] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={loading}
                      className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-60"
                    >
                      Send
                    </button>
                  </div>
                </section>

                <aside className="rounded-[28px] border border-white/10 bg-[#111318] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Context</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Uploaded Sources</h3>
                  <div className="mt-5 space-y-3">
                    {documents.length === 0 ? (
                      <div className="rounded-2xl border border-white/10 bg-[#0d1016] p-4 text-sm text-zinc-500">
                        No uploaded documents yet.
                      </div>
                    ) : (
                      documents.map((doc, index) => (
                        <div key={index} className="rounded-2xl border border-white/10 bg-[#0d1016] p-4">
                          <p className="text-sm font-medium text-white">{doc.filename}</p>
                          <p className="mt-2 text-xs leading-6 text-zinc-500">Ready for AI search</p>
                        </div>
                      ))
                    )}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
