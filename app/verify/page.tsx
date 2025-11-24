"use client";

import Link from "next/link";
import { VerifyForm } from "@/components/verify/VerifyForm";
import { VerifyResult } from "@/components/verify/VerifyResult";
import { useState } from "react";
import { VerifyResponse } from "@/lib/api";

export default function VerifyPage() {
  const [result, setResult] = useState<VerifyResponse | null>(null);

  return (
    <main className="min-h-screen">
      <div className="container">
        <header className="mb-6">
          <div className="card card-green mb-4">
            <h1>VERIFY FILE</h1>
          </div>
          <Link href="/" className="btn btn-yellow">
            ← BACK
          </Link>
        </header>

        <div className="space-y-6">
          <VerifyForm onResult={setResult} />
          {result && <VerifyResult result={result} />}
        </div>
      </div>
    </main>
  );
}

