"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

type UploadedFile = {
  id: number;
  filename: string;
  created_at?: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function UploadsPage() {
  const { getToken, isLoaded, userId } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [status, setStatus] = useState("");

  const fetchFiles = async () => {
    try {
      setLoadingFiles(true);

      const token = await getToken();
      const res = await axios.get(`${API}/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFiles(res.data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setStatus("Please choose a PDF file.");
      return;
    }

    try {
      setUploading(true);
      setStatus("");

      const token = await getToken();
      if (!token) {
        setStatus("Missing auth token");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${API}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus(res.data.message || "Uploaded successfully");
      setFile(null);
      await fetchFiles();
    } catch (error: any) {
      console.error("Upload failed:", error);
      setStatus(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      setLoadingFiles(false);
      return;
    }
    fetchFiles();
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
                  Uploads
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                  Knowledge Upload Center
                </h1>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <section className="rounded-[28px] border border-white/10 bg-[#111318] p-5">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                    Upload
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Add your files
                  </h3>

                  <div className="mt-6 rounded-[24px] border border-white/10 bg-[#0b0d10] p-5">
                    <div className="rounded-2xl border border-dashed border-white/10 bg-[#0d1016] p-5">
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => {
                          const selected = e.target.files?.[0] || null;
                          setFile(selected);
                          setStatus("");
                        }}
                        className="block w-full text-sm text-zinc-300 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
                      />

                      <button
                        onClick={uploadFile}
                        disabled={uploading || !file}
                        className="mt-4 w-full rounded-2xl bg-[#2563eb] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {uploading ? "Uploading..." : "Upload File"}
                      </button>

                      {status && (
                        <div className="mt-4 rounded-2xl border border-white/10 bg-[#111318] px-4 py-3 text-sm text-zinc-300">
                          {status}
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <section className="rounded-[28px] border border-white/10 bg-[#111318] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                        Library
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">
                        Uploaded files
                      </h3>
                    </div>

                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                      {files.length} items
                    </div>
                  </div>

                  <div className="mt-6 rounded-[24px] border border-white/10 bg-[#0b0d10] p-5">
                    {loadingFiles ? (
                      <div className="text-zinc-500">Loading files...</div>
                    ) : files.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-[#0d1016] px-6 py-16 text-center">
                        <p className="text-xl text-white">No files uploaded yet</p>
                        <p className="mt-3 text-sm text-zinc-500">
                          Upload your first file from the panel on the left.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {files.map((doc) => (
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
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
