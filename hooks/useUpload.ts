"use client";

import { useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { hashFile } from "@/lib/hasher";
import { uploadFile, UploadRequest, UploadResponse, ApiError } from "@/lib/api";

// Simple UUID generator (no external dependency needed)
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface UploadState {
  status: "idle" | "hashing" | "signing" | "uploading" | "success" | "error";
  progress: number;
  error: string | null;
  result: UploadResponse | null;
}

export function useUpload() {
  const { user, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [state, setState] = useState<UploadState>({
    status: "idle",
    progress: 0,
    error: null,
    result: null,
  });

  const upload = async (file: File) => {
    if (!authenticated || !user) {
      setState({
        status: "error",
        progress: 0,
        error: "Please login first",
        result: null,
      });
      return;
    }

    if (!wallets || wallets.length === 0) {
      setState({
        status: "error",
        progress: 0,
        error: "No wallet available",
        result: null,
      });
      return;
    }

    try {
      // Step 1: Hash file
      setState((prev) => ({ ...prev, status: "hashing", progress: 10 }));
      const mediaHash = await hashFile(file);

      // Step 2: Generate nonce and timestamp
      const nonce = generateUUID();
      const timestamp = Date.now();
      const messageToSign = `${mediaHash}|${timestamp}|${nonce}`;

      // Step 3: Sign message
      setState((prev) => ({ ...prev, status: "signing", progress: 30 }));
      const wallet = wallets[0];
      let userSignature: string;

      try {
        // Privy ConnectedWallet signing
        // Convert message to Uint8Array for signing
        const messageBytes = new TextEncoder().encode(messageToSign);
        
        // Use signPersonalMessage method from Privy wallet
        // Privy ConnectedWallet has signPersonalMessage method
        if ("signPersonalMessage" in wallet && typeof (wallet as any).signPersonalMessage === "function") {
          const signatureResult = await (wallet as any).signPersonalMessage(messageBytes);
          // Signature might be in different formats, convert to hex string
          if (typeof signatureResult === "string") {
            userSignature = signatureResult;
          } else if (signatureResult?.signature) {
            userSignature = typeof signatureResult.signature === "string" 
              ? signatureResult.signature 
              : Buffer.from(signatureResult.signature).toString("hex");
          } else {
            userSignature = Buffer.from(signatureResult).toString("hex");
          }
        } else {
          // Fallback: try signMessage method
          const sig = await (wallet as any).signMessage(messageToSign);
          userSignature = typeof sig === "string" ? sig : Buffer.from(sig).toString("hex");
        }
      } catch (signError: any) {
        throw new Error(`Signing failed: ${signError.message}`);
      }

      // Step 4: Upload to backend
      setState((prev) => ({ ...prev, status: "uploading", progress: 50 }));

      const uploadData: UploadRequest = {
        file,
        mediaHash,
        userSignature,
        userPublicKey: wallet.address, // Use address as public key identifier
        userWalletAddress: wallet.address,
        timestamp,
        nonce,
      };

      const result = await uploadFile(uploadData);

      setState({
        status: "success",
        progress: 100,
        error: null,
        result,
      });
    } catch (error: any) {
      setState({
        status: "error",
        progress: 0,
        error: error.message || "Upload failed",
        result: null,
      });
    }
  };

  const reset = () => {
    setState({
      status: "idle",
      progress: 0,
      error: null,
      result: null,
    });
  };

  return {
    upload,
    reset,
    ...state,
  };
}

