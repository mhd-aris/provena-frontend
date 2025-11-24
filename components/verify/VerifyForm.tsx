"use client";

import { useState, useRef, useEffect } from "react";
import { useVerify } from "@/hooks/useVerify";
import { VerifyResponse } from "@/lib/api";

interface VerifyFormProps {
  onResult?: (result: VerifyResponse) => void;
}

export function VerifyForm({ onResult }: VerifyFormProps) {
  const { verify, status, result, error, reset } = useVerify();
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState("");
  const [blobId, setBlobId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      reset();
    }
  };

  const handleVerify = async () => {
    if (file) {
      await verify({ file });
    } else if (hash) {
      await verify({ hash });
    } else if (blobId) {
      await verify({ blobId });
    } else {
      alert("Please provide a file, hash, or blob ID");
    }
  };

  // Update parent when result changes
  useEffect(() => {
    if (result && onResult) {
      onResult(result);
    }
  }, [result, onResult]);

  return (
    <div className="card card-green">
      <h2 className="text-2xl mb-4">VERIFY FILE</h2>

      <div className="space-y-4">
        {/* File Upload Option */}
        <div>
          <label className="block font-bold mb-2">UPLOAD FILE</label>
          <div
            className="border-3 border-dashed border-black p-6 text-center cursor-pointer hover:bg-yellow transition-colors"
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
              <p className="font-bold">CLICK TO SELECT FILE</p>
            )}
          </div>
        </div>

        {/* OR Divider */}
        <div className="text-center">
          <p className="font-bold text-lg">OR</p>
        </div>

        {/* Hash Input */}
        <div>
          <label className="block font-bold mb-2">MEDIA HASH</label>
          <input
            type="text"
            value={hash}
            onChange={(e) => {
              setHash(e.target.value);
              setFile(null);
              reset();
            }}
            placeholder="Enter SHA-256 hash"
          />
        </div>

        {/* Blob ID Input */}
        <div>
          <label className="block font-bold mb-2">WALRUS BLOB ID</label>
          <input
            type="text"
            value={blobId}
            onChange={(e) => {
              setBlobId(e.target.value);
              setFile(null);
              reset();
            }}
            placeholder="Enter Walrus blob ID"
          />
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={status === "verifying" || status === "hashing"}
          className="btn btn-green w-full"
        >
          {status === "idle" ? "VERIFY" : status === "hashing" ? "HASHING..." : "VERIFYING..."}
        </button>

        {/* Status Messages */}
        {status === "hashing" && (
          <div className="status-box status-info">
            <p className="font-bold">HASHING FILE...</p>
          </div>
        )}

        {status === "verifying" && (
          <div className="status-box status-warning">
            <p className="font-bold">VERIFYING...</p>
          </div>
        )}

        {error && (
          <div className="status-box status-error">
            <p className="font-bold mb-2">ERROR</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
