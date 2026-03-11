"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { UserDashboard } from "./UserDashboard";
import { HostDashboard } from "./HostDashboard";

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}

function AccountContent() {
  const { user, isHost } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-50/60">
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 lg:px-8">
        {/* Welcome header */}
        <div className="mb-8 flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="h-14 w-14 rounded-full border-4 border-emerald-50 object-cover ring-4 ring-emerald-50"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700 ring-4 ring-emerald-50">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">
              Welcome back, {user.fullName}
            </h1>
            <p className="text-sm text-zinc-500 capitalize">
              {user.role === "host" ? "Host Account" : "Guest Account"} &middot; {user.email}
            </p>
          </div>
        </div>

        {isHost ? <HostDashboard /> : <UserDashboard />}
      </div>
    </div>
  );
}
