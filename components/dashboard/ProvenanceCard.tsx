"use client";

import { ProvenanceRecord } from "@/lib/api";

interface ProvenanceCardProps {
  record: ProvenanceRecord;
}

export function ProvenanceCard({ record }: ProvenanceCardProps) {
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getSuiExplorerUrl = (txDigest: string) => {
    return `https://suiexplorer.com/txblock/${txDigest}?network=testnet`;
  };

  return (
    <div className="card card-cyan">
      <div className="space-y-3">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <h3 className="text-xl font-black">PROVENANCE RECORD</h3>
          <span className="status-box status-success text-xs font-bold inline-block">
            VERIFIED
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="space-y-2">
            <div>
              <p className="font-bold mb-1">HASH:</p>
              <p className="font-mono text-xs break-all mb-1">{record.mediaHash}</p>
              <button
                onClick={() => copyToClipboard(record.mediaHash)}
                className="btn btn-black text-xs"
              >
                COPY
              </button>
            </div>

            <div>
              <p className="font-bold mb-1">WALRUS BLOB ID:</p>
              <p className="font-mono text-xs break-all mb-1">{record.walrusBlobId}</p>
              <button
                onClick={() => copyToClipboard(record.walrusBlobId)}
                className="btn btn-black text-xs"
              >
                COPY
              </button>
            </div>

            <div>
              <p className="font-bold mb-1">TIMESTAMP:</p>
              <p>{formatTimestamp(record.timestamp)}</p>
            </div>

            <div>
              <p className="font-bold mb-1">SUI TRANSACTION:</p>
              <a
                href={getSuiExplorerUrl(record.suiTxDigest)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs break-all underline mb-1 block"
              >
                {record.suiTxDigest}
              </a>
              <button
                onClick={() => copyToClipboard(record.suiTxDigest)}
                className="btn btn-black text-xs"
              >
                COPY
              </button>
            </div>

            <div>
              <p className="font-bold mb-1">USER ADDRESS:</p>
              <p className="font-mono text-xs break-all">{record.userAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

