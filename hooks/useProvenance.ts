"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { queryProvenance, ProvenanceRecord, ApiError } from "@/lib/api";

interface ProvenanceState {
  records: ProvenanceRecord[];
  loading: boolean;
  error: string | null;
}

export function useProvenance() {
  const { user, authenticated } = usePrivy();
  const [state, setState] = useState<ProvenanceState>({
    records: [],
    loading: false,
    error: null,
  });

  const fetchRecords = async () => {
    if (!authenticated || !user?.wallet?.address) {
      setState({ records: [], loading: false, error: "Not authenticated" });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const records = await queryProvenance({
        user: user.wallet.address,
      });

      setState({
        records,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        records: [],
        loading: false,
        error: error.message || "Failed to fetch provenance records",
      });
    }
  };

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetchRecords();
    }
  }, [authenticated, user?.wallet?.address]);

  return {
    ...state,
    refetch: fetchRecords,
  };
}


