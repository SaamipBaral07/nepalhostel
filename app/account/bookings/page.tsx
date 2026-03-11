"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, ArrowLeft, Star } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { bookingsApi } from "@/lib/api/bookings";
import type { Booking } from "@/lib/types";

const statusVariant: Record<string, "success" | "warning" | "info" | "danger" | "default"> = {
  confirmed: "success",
  pending: "warning",
  completed: "info",
  cancelled: "danger",
};

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <BookingsContent />
    </ProtectedRoute>
  );
}

function BookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bookingsApi
      .myBookings()
      .then((res) => setBookings(res.results))
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

      <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">
        My Bookings
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Track all your hostel bookings
      </p>

      {isLoading ? (
        <div className="mt-8 flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-zinc-300 py-16 text-center">
          <Calendar className="mx-auto h-10 w-10 text-zinc-300" />
          <p className="mt-4 text-lg font-medium text-zinc-600">No bookings yet</p>
          <p className="mt-1 text-sm text-zinc-400">Browse hostels and make your first booking.</p>
          <Link
            href="/hostels"
            className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Browse Hostels →
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-emerald-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900">
                    {booking.hostel.name}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {booking.hostel.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {booking.checkIn} → {booking.checkOut}
                    </span>
                    <span className="capitalize">{booking.stayType} stay</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Badge
                  variant={statusVariant[booking.status]}
                  className="capitalize"
                >
                  {booking.status}
                </Badge>
                {(booking.status === "confirmed" || booking.status === "completed") &&
                  new Date(booking.checkOut) <= new Date() && (
                    <Link
                      href={`/hostels/${booking.hostel.slug || booking.hostel.id}#reviews`}
                      className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-100"
                    >
                      <Star className="h-3 w-3" />
                      Write Review
                    </Link>
                  )}
                <span className="text-lg font-bold text-zinc-900">
                  {formatPrice(booking.totalAmount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
