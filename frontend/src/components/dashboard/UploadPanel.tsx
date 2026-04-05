"use client";

import { ChangeEvent } from "react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";

type Props = {
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  uploadFile: () => void;
  uploadMsg: string;
  uploading: boolean;
};

export default function UploadPanel({
  handleFileChange,
  uploadFile,
  uploadMsg,
  uploading,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="p-6">
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">Uploads</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Upload files</h3>
        </div>

        <div className="rounded-[24px] border border-dashed border-white/10 bg-[#0d1016] p-5">
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
      </Card>
    </motion.div>
  );
}
