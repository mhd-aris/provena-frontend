"use client";

import { VerifyResponse } from "@/lib/api";

interface VerifyResultProps {
  result: VerifyResponse;
}

export function VerifyResult({ result }: VerifyResultProps) {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSuiExplorerUrl = (txDigest: string) => {
    if (!result.record?.suiTxDigest) return "#";
    return `https://suiexplorer.com/txblock/${result.record.suiTxDigest}?network=testnet`;
  };

  return (
    <div className="card">
      <div className={`status-box mb-4 ${
        result.valid ? "status-success" : "status-error"
      }`}>
        <h3 className="text-2xl font-black mb-2">
          {result.valid ? "✓ VERIFIED" : "✗ NOT VERIFIED"}
        </h3>
        <p className="text-lg">
          {result.valid
            ? "File authenticity verified"
            : "File authenticity could not be verified"}
        </p>
      </div>

      {result.valid && result.record && (
        <div className="space-y-3">
          <h4 className="text-xl font-bold">VERIFICATION DETAILS</h4>

          <div className="space-y-2 text-sm">
            {result.hashMatch !== undefined && (
              <div>
                <p className="font-bold">Hash Match:</p>
                <p>{result.hashMatch ? "✓ Yes" : "✗ No"}</p>
              </div>
            )}

            {result.walrusExists !== undefined && (
              <div>
                <p className="font-bold">Walrus Storage:</p>
                <p>{result.walrusExists ? "✓ Exists" : "✗ Not found"}</p>
              </div>
            )}

            {result.onChainExists !== undefined && (
              <div>
                <p className="font-bold">On-Chain Record:</p>
                <p>{result.onChainExists ? "✓ Exists" : "✗ Not found"}</p>
              </div>
            )}

            {result.onChainTimestamp && (
              <div>
                <p className="font-bold">On-Chain Timestamp:</p>
                <p>{formatTimestamp(result.onChainTimestamp)}</p>
              </div>
            )}

            {result.record.mediaHash && (
              <div>
                <p className="font-bold">Media Hash:</p>
                <p className="font-mono text-xs break-all">{result.record.mediaHash}</p>
              </div>
            )}

            {result.record.walrusBlobId && (
              <div>
                <p className="font-bold">Walrus Blob ID:</p>
                <p className="font-mono text-xs break-all">{result.record.walrusBlobId}</p>
              </div>
            )}

            {result.record.suiTxDigest && (
              <div>
                <p className="font-bold">Sui Transaction:</p>
                <a
                  href={getSuiExplorerUrl(result.record.suiTxDigest)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs break-all underline hover:text-blue-600"
                >
                  {result.record.suiTxDigest}
                </a>
              </div>
            )}

            {result.record.userAddress && (
              <div>
                <p className="font-bold">Uploader:</p>
                <p className="font-mono text-xs break-all">{result.record.userAddress}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!result.valid && (
        <div className="status-box status-error">
          <p className="font-bold mb-2 text-lg">VERIFICATION FAILED</p>
          <p className="text-sm mb-2">
            The file could not be verified. Possible reasons:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>File hash does not match any recorded provenance</li>
            <li>File was not uploaded to Provena</li>
            <li>File has been modified</li>
          </ul>
        </div>
      )}
    </div>
  );
}

