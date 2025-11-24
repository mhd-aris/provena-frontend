"use client";

import { useState } from "react";
import { hashFile } from "@/lib/hasher";
import { verifyFile, VerifyRequest, VerifyResponse, ApiError } from "@/lib/api";

interface VerifyState {
  status: "idle" | "hashing" | "verifying" | "success" | "error";
  result: VerifyResponse | null;
  error: string | null;
}

export function useVerify() {
  const [state, setState] = useState<VerifyState>({
    status: "idle",
    result: null,
    error: null,
  });

  const verify = async (data: { file?: File; hash?: string; blobId?: string }) => {
    try {
      setState({ status: "idle", result: null, error: null });

      let mediaHash = data.hash;

      // If file provided, hash it
      if (data.file && !mediaHash) {
        setState((prev) => ({ ...prev, status: "hashing" }));
        mediaHash = await hashFile(data.file);
      }

      if (!mediaHash && !data.blobId) {
        throw new Error("Either file, hash, or blobId must be provided");
      }

      // Verify
      setState((prev) => ({ ...prev, status: "verifying" }));

      const verifyRequest: VerifyRequest = {
        mediaHash,
        walrusBlobId: data.blobId,
        file: data.file,
      };

      const result = await verifyFile(verifyRequest);

      setState({
        status: "success",
        result,
        error: null,
      });
    } catch (error: any) {
      setState({
        status: "error",
        result: null,
        error: error.message || "Verification failed",
      });
    }
  };

  const reset = () => {
    setState({
      status: "idle",
      result: null,
      error: null,
    });
  };

  return {
    verify,
    reset,
    ...state,
  };
}


