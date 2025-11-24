"use client";

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { ProvenanceList } from "@/components/dashboard/ProvenanceList";

export default function DashboardPage() {
  const { ready, authenticated, login } = usePrivy();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen">
        <div className="container">
          <header className="mb-6">
            <div className="card card-cyan mb-4">
              <h1>PROVENA DASHBOARD</h1>
            </div>
            <Link href="/" className="btn btn-yellow">
              ← BACK
            </Link>
          </header>
          <div className="card">
            <h2 className="text-2xl mb-4">LOGIN REQUIRED</h2>
            <p className="text-lg mb-4">Please login to view your provenance records</p>
            <button onClick={login} className="btn btn-yellow">
              LOGIN
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container">
        <header className="mb-6">
          <div className="card card-cyan mb-4">
            <h1>PROVENANCE DASHBOARD</h1>
          </div>
          <Link href="/" className="btn btn-yellow">
            ← BACK TO UPLOAD
          </Link>
        </header>

        <ProvenanceList />
      </div>
    </main>
  );
}

