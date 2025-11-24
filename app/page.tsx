"use client";

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { UploadForm } from "@/components/upload/UploadForm";

export default function Home() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container">
        {/* Header */}
        <header className="mb-6">
          <div className="card card-yellow mb-4">
            <h1>PROVENA</h1>
            <p className="text-lg">
              Provably Authentic File Provenance on Sui Blockchain
            </p>
          </div>

          {/* Navigation */}
          <nav>
            <Link href="/" className="btn btn-yellow">
              UPLOAD
            </Link>
            <Link href="/dashboard" className="btn btn-cyan">
              DASHBOARD
            </Link>
            <Link href="/verify" className="btn btn-green">
              VERIFY
            </Link>
          </nav>

          {/* Auth Status */}
          {authenticated ? (
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="status-box status-success">
                <p className="text-sm font-bold">
                  LOGGED IN: {user?.email?.address || user?.wallet?.address?.slice(0, 10) + "..."}
                </p>
              </div>
              <button onClick={logout} className="btn btn-black">
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="mb-4">
              <button onClick={login} className="btn btn-yellow">
                LOGIN TO CONTINUE
              </button>
            </div>
          )}
        </header>

        {/* Main Content */}
        {authenticated ? (
          <UploadForm />
        ) : (
          <div className="card">
            <h2 className="text-2xl mb-4">WELCOME TO PROVENA</h2>
            <p className="text-lg mb-4">Please login to upload files</p>
            <p className="text-sm">
              Provena uses Privy for authentication. Login with email, Google, or Twitter to get started.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
