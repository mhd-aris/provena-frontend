/**
 * API client for Provena backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface UploadRequest {
  file: File;
  // Note: mediaHash is computed in TEE (backend), not in frontend
  // User signs after backend computes hash and gets TEE attestation
  userSignature: string;
  userPublicKey: string;
  userWalletAddress: string;
  timestamp: number;
  nonce: string;
  sessionToken?: string;
}

export interface UploadResponse {
  id: string;
  userAddress: string;
  walrusBlobId: string;
  mediaHash: string; // Hash computed in TEE
  timestamp: number;
  userSignature: string;
  suiTxDigest: string;
  teeAttestationHash?: string; // TEE attestation hash
  receipt?: {
    uploader: string;
    walrusBlobId: string;
    mediaHash: string;
    timestamp: number;
    userSignature: string;
    suiTxDigest: string;
    teeAttestationHash?: string;
  };
}

export interface VerifyRequest {
  mediaHash?: string;
  walrusBlobId?: string;
  file?: File;
}

export interface VerifyResponse {
  valid: boolean;
  hashMatch?: boolean;
  walrusExists?: boolean;
  onChainExists?: boolean;
  onChainTimestamp?: number;
  record?: ProvenanceRecord;
}

export interface ProvenanceRecord {
  id: string;
  userAddress: string;
  walrusBlobId: string;
  mediaHash: string;
  timestamp: number;
  suiTxDigest: string;
  createdAt?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Upload file to backend
 */
/**
 * Upload file to backend
 * Flow: Backend computes hash in TEE → User signs → Backend publishes to Sui
 * 
 * Note: Hash is computed in TEE (backend), not in frontend
 * Frontend only needs to sign the payload after backend provides hash + TEE attestation
 */
export async function uploadFile(data: UploadRequest): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", data.file);
  // Note: mediaHash is NOT sent from frontend - computed in TEE
  formData.append("userSignature", data.userSignature);
  formData.append("userPublicKey", data.userPublicKey);
  formData.append("userWalletAddress", data.userWalletAddress);
  formData.append("timestamp", data.timestamp.toString());
  formData.append("nonce", data.nonce);
  
  if (data.sessionToken) {
    formData.append("sessionToken", data.sessionToken);
  }

  const response = await fetch(`${API_BASE}/api/v1/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Upload failed" }));
    throw new ApiError(
      error.message || "Upload failed",
      response.status,
      error
    );
  }

  return response.json();
}

/**
 * Verify file authenticity
 */
export async function verifyFile(data: VerifyRequest): Promise<VerifyResponse> {
  const formData = new FormData();
  
  if (data.file) {
    formData.append("file", data.file);
  }
  if (data.mediaHash) {
    formData.append("mediaHash", data.mediaHash);
  }
  if (data.walrusBlobId) {
    formData.append("walrusBlobId", data.walrusBlobId);
  }

  const response = await fetch(`${API_BASE}/api/v1/verify`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Verification failed" }));
    throw new ApiError(
      error.message || "Verification failed",
      response.status,
      error
    );
  }

  return response.json();
}

/**
 * Get provenance record by ID
 */
export async function getProvenanceById(id: string): Promise<ProvenanceRecord> {
  const response = await fetch(`${API_BASE}/api/v1/provenance/${id}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to get provenance" }));
    throw new ApiError(
      error.message || "Failed to get provenance",
      response.status,
      error
    );
  }

  return response.json();
}

/**
 * Query provenance records
 */
export async function queryProvenance(params: {
  hash?: string;
  user?: string;
}): Promise<ProvenanceRecord[]> {
  const queryParams = new URLSearchParams();
  if (params.hash) queryParams.append("hash", params.hash);
  if (params.user) queryParams.append("user", params.user);

  const response = await fetch(
    `${API_BASE}/api/v1/provenance?${queryParams.toString()}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to query provenance" }));
    throw new ApiError(
      error.message || "Failed to query provenance",
      response.status,
      error
    );
  }

  return response.json();
}


