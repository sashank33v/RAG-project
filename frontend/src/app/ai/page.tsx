"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

type DocumentItem = {
  id: number;
  filename: string;
  created_at?: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AIPage() {
  const { getToken, isLoaded, userId } = useAuth();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to your AI workspace. Ask about uploaded files and I'll answer from them.",
    },
  ]);
  const [question, setQuestion] = useState("");
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [asking, setAsking] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);
      const token = await getToken();

      const res = await axios.get(`${API}/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDocuments(res.data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    const userMessage = question.trim();

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);
    setQuestion("");
    setAsking(true);

    try {
      const token = await getToken();

      const res = await axios.post(
        `${API}/ask`,
        { question: userMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.answer || "No answer returned.",
        },
      ]);
    } catch (error) {
      console.error("Ask failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to get answer.",
        },
      ]);
    } finally {
      setAsking(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      setLoadingDocs(false);
      return;
    }
    fetchDocuments();
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
                  AI Workspace
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  Ask your second brain
                </h1>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
                <section className="rounded-[28px] border border-white/10 bg-[#111318] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                        Conversation
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">
                        AI Chat
                      </h3>
                    </div>

                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                      {documents.length} docs
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-[#0b0d10] p-4">
                    <div className="mb-4 max-h-[420px] space-y-4 overflow-y-auto rounded-2xl border border-white/10 bg-[#0d1016] p-4">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                            message.role === "user"
                              ? "ml-auto bg-white text-black"
                              : "bg-[#121826] text-zinc-200"
                          }`}
                        >
                          {message.content}
                        </div>
                      ))}

                      {asking && (
                        <div className="max-w-[80%] rounded-2xl bg-[#121826] px-4 py-3 text-sm text-zinc-400">
                          Thinking...
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAsk();
                          }
                        }}
                        placeholder="Ask AI about uploaded files..."
                        className="flex-1 rounded-2xl border border-white/10 bg-[#0d1016] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
                      />
                      <button
                        onClick={handleAsk}
                        disabled={asking}
                        className="rounded-2xl bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-50"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </section>

                <aside className="rounded-[28px] border border-white/10 bg-[#111318] p-5">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                    Context
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    Uploaded Sources
                  </h3>

                  <div className="mt-6 space-y-3">
                    {loadingDocs ? (
                      <div className="text-zinc-500">Loading documents...</div>
                    ) : documents.length === 0 ? (
                      <div className="text-zinc-500">No documents uploaded yet.</div>
                    ) : (
                      documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="rounded-2xl border border-white/10 bg-[#0d1016] p-4"
                        >
                          <p className="text-sm font-medium text-white">
                            {doc.filename}
                          </p>
                          <p className="mt-2 text-xs text-zinc-500">
                            Ready for AI search
                          </p>
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
