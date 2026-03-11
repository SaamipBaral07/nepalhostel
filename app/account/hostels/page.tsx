"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Users, Eye, Edit, PlusCircle } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge, Button } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { hostelsApi } from "@/lib/api/hostels";
import type { HostelSummary } from "@/lib/types";

export default function HostHostelsPage() {
  return (
    <ProtectedRoute allowedRoles={["host"]}>
      <HostHostelsContent />
    </ProtectedRoute>
  );
}

function HostHostelsContent() {
  const [listings, setListings] = useState<HostelSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    hostelsApi
      .myListings()
      .then((res) => setListings(res.results))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 lg:px-8">
      <Link
        href="/account"
        className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-emerald-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">
            My Hostels
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage your hostel listings
          </p>
        </div>
        <Link href="/account/hostels/new">
          <Button>
            <PlusCircle className="h-4 w-4" />
            Add Hostel
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-8 flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      ) : listings.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 py-16 text-center">
          <Building2 className="mx-auto h-10 w-10 text-zinc-300" />
          <p className="mt-4 text-lg font-medium text-zinc-600">No hostels yet</p>
          <p className="mt-1 text-sm text-zinc-400">Add your first hostel to get started.</p>
          <Link href="/account/hostels/new">
            <Button className="mt-6">
              <PlusCircle className="h-4 w-4" />
              Add Your First Hostel
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {listings.map((hostel) => (
            <div
              key={hostel.id}
              className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900">{hostel.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {hostel.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {hostel.availableBeds} beds available
                    </span>
                    <span>{formatPrice(hostel.pricePerMonth)}/mo</span>
                    <span className="capitalize">{hostel.genderCategory}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success">Active</Badge>
                <Link
                  href={`/hostels/${hostel.slug}`}
                  className="rounded-lg border border-zinc-200 p-2 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600"
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <Link
                  href={`/account/hostels/${hostel.id}/edit`}
                  className="rounded-lg border border-zinc-200 p-2 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
