"use client";

import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import Hero from "@/components/dashboard/Hero";
import QuickCapture from "@/components/dashboard/QuickCapture";
import MemoryGrid from "@/components/dashboard/MemoryGrid";
import UploadPanel from "@/components/dashboard/UploadPanel";

type Note = {
  id: string;
  content: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [savingNote, setSavingNote] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoadingNotes(true);
      const res = await axios.get(`${API}/notes`);
      setNotes(res.data);
    } catch (error) {
      console.error("Notes fetch failed:", error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const addNote = async () => {
    if (!input.trim()) return;

    try {
      setSavingNote(true);
      await axios.post(`${API}/notes?content=${encodeURIComponent(input)}`);
      setInput("");
      await fetchNotes();
    } catch (error) {
      console.error("Note save failed:", error);
    } finally {
      setSavingNote(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setUploadMsg(selected ? `Selected: ${selected.name}` : "");
  };

  const uploadFile = async () => {
    if (!file) {
      setUploadMsg("Please choose a file first");
      return;
    }

    try {
      setUploading(true);
      setUploadMsg("Uploading...");

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${API}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadMsg(`Uploaded successfully: ${res.data.filename}`);
      setFile(null);

      const inputEl = document.getElementById("file-upload") as HTMLInputElement | null;
      if (inputEl) inputEl.value = "";
    } catch (error: any) {
      console.error("Upload failed:", error);
      setUploadMsg(error?.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0d10] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar />

        <section className="flex-1">
          <Topbar />

          <div className="px-6 py-8 lg:px-8">
            <div className="mx-auto max-w-[1400px]">
              <Hero notesCount={notes.length} />

              <section className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <QuickCapture
                  input={input}
                  setInput={setInput}
                  addNote={addNote}
                  savingNote={savingNote}
                />
                <UploadPanel
                  handleFileChange={handleFileChange}
                  uploadFile={uploadFile}
                  uploadMsg={uploadMsg}
                  uploading={uploading}
                />
              </section>

              <section className="mt-8">
                <MemoryGrid notes={notes} loadingNotes={loadingNotes} />
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
