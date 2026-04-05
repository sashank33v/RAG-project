"use client";

import { ChangeEvent, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type UploadedFile = {
  name: string;
  status: string;
};

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

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
      setUploadedFiles((prev) => [
        { name: res.data.filename, status: "Ready" },
        ...prev,
      ]);
      setFile(null);

      const inputEl = document.getElementById("file-upload") as HTMLInputElement | null;
      if (inputEl) inputEl.value = "";
    } catch (error: any) {
      setUploadMsg(error?.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
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
                <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
                  Uploads
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  Knowledge Upload Center
                </h1>
              </div>

              <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <section className="rounded-[28px] border border-white/10 bg-[#111318] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                    Upload
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Add your files
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">
                    Upload PDFs, notes, docs, or research files for your second brain.
                  </p>

                  <div className="mt-6 rounded-[24px] border border-dashed border-white/10 bg-[#0d1016] p-6">
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
                    />

                    <button
                      onClick={uploadFile}
                      disabled={uploading}
                      className="mt-5 w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
                    >
                      {uploading ? "Uploading..." : "Upload File"}
                    </button>

                    {uploadMsg && (
                      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
                        {uploadMsg}
                      </div>
                    )}
                  </div>
                </section>

                <section className="rounded-[28px] border border-white/10 bg-[#111318] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                        Library
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">
                        Uploaded files
                      </h2>
                    </div>

                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">
                      {uploadedFiles.length} items
                    </div>
                  </div>

                  {uploadedFiles.length === 0 ? (
                    <div className="flex min-h-[320px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-[#0d1016]">
                      <div className="text-center">
                        <p className="text-lg font-medium text-zinc-300">
                          No files uploaded yet
                        </p>
                        <p className="mt-2 text-sm text-zinc-500">
                          Upload your first file from the panel on the left.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {uploadedFiles.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-[22px] border border-white/10 bg-[#0d1016] p-5 transition hover:border-white/20 hover:bg-[#10141c]"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-white">
                                {item.name}
                              </p>
                              <p className="mt-2 text-xs text-zinc-500">
                                Ready for processing
                              </p>
                            </div>

                            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
