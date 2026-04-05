"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AIPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const { getToken } = useAuth();

  const sendMessage = async () => {
    const token = await getToken();

    const res = await axios.post(
      `${API}/ask`,
      { question: input },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      { role: "ai", content: res.data.answer },
    ]);

    setInput("");
  };

  return (
    <div className="p-6">
      <div className="space-y-2">
        {messages.map((m, i) => (
          <div key={i}>{m.content}</div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 mt-4"
      />

      <button onClick={sendMessage} className="ml-2">
        Send
      </button>
    </div>
  );
}
