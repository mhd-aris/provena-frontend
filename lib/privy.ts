/**
 * Privy utilities for wallet access and signing
 */

import { usePrivy, useWallets } from "@privy-io/react-auth";

/**
 * Get user's wallet address
 */
export function useWalletAddress(): string | null {
  const { user } = usePrivy();
  return user?.wallet?.address || null;
}

/**
 * Get user's public key
 */
export function usePublicKey(): string | null {
  const { user } = usePrivy();
  // Privy wallets use secp256k1 or secp256r1
  // Public key is available in wallet object
  return user?.wallet?.address || null; // For now, use address as identifier
}

/**
 * Sign a message with user's wallet
 */
export async function signMessage(
  message: string,
  wallet: any
): Promise<string> {
  try {
    // Privy wallet signing
    const signature = await wallet.signMessage(message);
    return signature;
  } catch (error) {
    console.error("Signing error:", error);
    throw new Error("Failed to sign message");
  }
}

/**
 * Get wallet type (secp256k1 or secp256r1)
 */
export function getWalletType(user: any): "secp256k1" | "secp256r1" {
  // Privy embedded wallets typically use secp256r1
  // But we need to check the actual wallet type
  // For now, default to secp256r1 for Privy embedded wallets
  return "secp256r1";
}


