"use client";

import { useState, useRef } from "react";
import { useUpload } from "@/hooks/useUpload";
import { usePrivy } from "@privy-io/react-auth";

export function UploadForm() {
  const { authenticated } = usePrivy();
  const { upload, status, progress, error, result, reset } = useUpload();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (200MB limit)
      const maxSize = 200 * 1024 * 1024; // 200MB
      if (selectedFile.size > maxSize) {
        alert("File size exceeds 200MB limit");
        return;
      }
      setFile(selectedFile);
      reset();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const maxSize = 200 * 1024 * 1024;
      if (droppedFile.size > maxSize) {
        alert("File size exceeds 200MB limit");
        return;
      }
      setFile(droppedFile);
      reset();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) return;
    await upload(file);
  };

  if (!authenticated) {
    return (
      <div className="card">
        <p className="text-lg">Please login to upload files</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card card-yellow">
        <h2 className="text-2xl mb-4">UPLOAD FILE</h2>

        {/* File Input */}
        <div
          className="border-4 border-dashed border-black p-8 text-center cursor-pointer hover:bg-yellow transition-colors mb-4"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />
          {file ? (
            <div>
              <p className="font-bold text-lg">{file.name}</p>
              <p className="text-sm mt-2">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <div>
              <p className="text-lg mb-2 font-bold">CLICK OR DRAG FILE HERE</p>
              <p className="text-sm">Max size: 200MB</p>
            </div>
          )}
        </div>

        {/* Status */}
        {status === "hashing" && (
          <div className="status-box status-info mb-4">
            <p className="font-bold">HASHING FILE...</p>
            <p>{Math.round(progress)}%</p>
          </div>
        )}

        {status === "signing" && (
          <div className="status-box status-pink mb-4">
            <p className="font-bold">PLEASE SIGN IN YOUR WALLET...</p>
          </div>
        )}

        {status === "uploading" && (
          <div className="status-box status-success mb-4">
            <p className="font-bold">UPLOADING...</p>
            <p>{Math.round(progress)}%</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="status-box status-error mb-4">
            <p className="font-bold mb-2">ERROR</p>
            <p>{error}</p>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="status-box status-success mb-4">
            <p className="font-bold mb-2 text-lg">✓ UPLOAD SUCCESS</p>
            <div className="space-y-2 text-sm font-mono">
              <p><strong>Hash:</strong> {result.mediaHash.slice(0, 32)}...</p>
              <p><strong>Blob ID:</strong> {result.walrusBlobId.slice(0, 32)}...</p>
              <p><strong>TX:</strong> {result.suiTxDigest.slice(0, 32)}...</p>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleUpload}
            disabled={!file || status !== "idle"}
            className="btn btn-yellow"
          >
            {status === "idle" ? "UPLOAD" : status.toUpperCase()}
          </button>

          {result && (
            <button
              onClick={() => {
                setFile(null);
                reset();
              }}
              className="btn btn-black"
            >
              UPLOAD ANOTHER
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

