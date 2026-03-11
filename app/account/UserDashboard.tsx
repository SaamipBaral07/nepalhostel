"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Search,
  ClipboardList,
  UserCircle,
} from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { bookingsApi } from "@/lib/api/bookings";
import type { Booking } from "@/lib/types";

const statusVariant: Record<string, "success" | "warning" | "info" | "default"> = {
  confirmed: "success",
  pending: "warning",
  completed: "info",
  cancelled: "danger" as "default",
};

export function UserDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bookingsApi
      .myBookings()
      .then((res) => setBookings(res.results))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const upcomingBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  );
  const pastBookings = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            href: "/hostels",
            icon: Search,
            title: "Find Hostels",
            desc: "Browse available hostels",
            color: "text-emerald-600 bg-emerald-50",
          },
          {
            href: "/account/bookings",
            icon: ClipboardList,
            title: "My Bookings",
            desc: `${bookings.length} total bookings`,
            color: "text-sky-600 bg-sky-50",
          },
          {
            href: "/account/profile",
            icon: UserCircle,
            title: "My Profile",
            desc: "View & edit profile",
            color: "text-violet-600 bg-violet-50",
          },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-emerald-200 hover:shadow-sm"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-zinc-900">{action.title}</p>
              <p className="text-sm text-zinc-500">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming Bookings */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">
            Upcoming Bookings
          </h2>
          <Link
            href="/account/bookings"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            View all →
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-zinc-300 py-10 text-center">
            <Calendar className="mx-auto h-8 w-8 text-zinc-300" />
            <p className="mt-3 text-sm text-zinc-500">No upcoming bookings</p>
            <Link href="/hostels">
              <Button variant="outline" size="sm" className="mt-4">
                Browse Hostels
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">
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
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={statusVariant[booking.status] || "default"}
                    className="capitalize"
                  >
                    {booking.status}
                  </Badge>
                  <span className="font-semibold text-zinc-900">
                    {formatPrice(booking.totalAmount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Past Bookings</h2>
          <div className="mt-4 space-y-3">
            {pastBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-3 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                    <CheckCircle2 className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-700">
                      {booking.hostel.name}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      {booking.checkIn} → {booking.checkOut}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="info" className="capitalize">
                    {booking.status}
                  </Badge>
                  <span className="text-sm font-medium text-zinc-500">
                    {formatPrice(booking.totalAmount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
