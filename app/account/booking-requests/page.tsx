"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge, Button } from "@/components/ui";
import { bookingsApi } from "@/lib/api/bookings";
import type { Booking } from "@/lib/types";

const statusVariant: Record<string, "success" | "warning" | "info" | "danger" | "default"> = {
  pending: "warning",
  confirmed: "success",
  cancelled: "danger",
  completed: "info",
};

export default function BookingRequestsPage() {
  return (
    <ProtectedRoute allowedRoles={["host"]}>
      <BookingRequestsContent />
    </ProtectedRoute>
  );
}

function BookingRequestsContent() {
  const [requests, setRequests] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  useEffect(() => {
    bookingsApi
      .hostelBookings()
      .then((res) => setRequests(res.results))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setActioningId(id);
    try {
      await bookingsApi.updateStatus(id, newStatus);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: newStatus as Booking["status"] } : r
        )
      );
    } catch {
      // silently handle
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 lg:px-8">
      <Link
        href="/account"
        className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-emerald-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">
        Booking Requests
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Review and manage booking requests from guests
      </p>

      {isLoading ? (
        <div className="mt-8 flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      ) : requests.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 py-16 text-center">
          <p className="text-lg font-medium text-zinc-600">No booking requests yet</p>
          <p className="mt-1 text-sm text-zinc-400">
            Requests will appear here when guests book your hostels.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      {request.user.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">
                        {request.user.fullName}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {request.user.email} · {request.user.phone}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-zinc-400">Hostel</p>
                      <p className="font-medium text-zinc-700">
                        {request.hostel.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-400">Duration</p>
                      <p className="font-medium text-zinc-700">
                        {request.checkIn} → {request.checkOut}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-400">Stay Type</p>
                      <p className="font-medium capitalize text-zinc-700">
                        {request.stayType}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-400">Amount</p>
                      <p className="font-medium text-zinc-700">
                        Rs. {Number(request.totalAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <Badge
                    variant={statusVariant[request.status]}
                    className="capitalize"
                  >
                    {request.status}
                  </Badge>

                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        isLoading={actioningId === request.id}
                        onClick={() =>
                          handleStatusUpdate(request.id, "confirmed")
                        }
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        isLoading={actioningId === request.id}
                        onClick={() =>
                          handleStatusUpdate(request.id, "cancelled")
                        }
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
