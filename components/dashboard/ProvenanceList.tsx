"use client";

import { useProvenance } from "@/hooks/useProvenance";
import { ProvenanceCard } from "./ProvenanceCard";

export function ProvenanceList() {
  const { records, loading, error, refetch } = useProvenance();

  if (loading) {
    return (
      <div className="card">
        <p className="text-lg font-bold">LOADING PROVENANCE RECORDS...</p>
        <div className="loading mt-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="status-box status-error mb-4">
          <p className="font-bold mb-2">ERROR</p>
          <p>{error}</p>
        </div>
        <button onClick={refetch} className="btn btn-black">
          RETRY
        </button>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="card card-pink">
        <h2 className="text-2xl mb-4">NO RECORDS FOUND</h2>
        <p className="text-lg mb-2">No provenance records found</p>
        <p className="text-sm">Upload a file to create your first record</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card card-green mb-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-2xl font-black">
            PROVENANCE RECORDS ({records.length})
          </h2>
          <button onClick={refetch} className="btn btn-cyan">
            REFRESH
          </button>
        </div>
      </div>

      <div className="grid grid-2">
        {records.map((record) => (
          <ProvenanceCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}

