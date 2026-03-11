"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Building2,
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Edit,
  MapPin,
} from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { hostelsApi } from "@/lib/api/hostels";
import { bookingsApi } from "@/lib/api/bookings";
import type { HostelSummary, Booking } from "@/lib/types";

export function HostDashboard() {
  const [listings, setListings] = useState<HostelSummary[]>([]);
  const [requests, setRequests] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([hostelsApi.myListings(), bookingsApi.hostelBookings()])
      .then(([hostelsRes, bookingsRes]) => {
        setListings(hostelsRes.results);
        setRequests(bookingsRes.results);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const confirmedGuests = requests.filter((r) => r.status === "confirmed").length;
  const totalRevenue = requests
    .filter((r) => r.status === "confirmed" || r.status === "completed")
    .reduce((sum, r) => sum + Number(r.totalAmount), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "My Hostels",
            value: listings.length,
            icon: Building2,
            color: "text-emerald-600 bg-emerald-50",
          },
          {
            label: "Total Bookings",
            value: requests.length,
            icon: Calendar,
            color: "text-sky-600 bg-sky-50",
          },
          {
            label: "Active Guests",
            value: confirmedGuests,
            icon: Users,
            color: "text-violet-600 bg-violet-50",
          },
          {
            label: "Revenue",
            value: formatPrice(totalRevenue),
            icon: TrendingUp,
            color: "text-amber-600 bg-amber-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-zinc-500">{stat.label}</p>
                <p className="text-xl font-bold text-zinc-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Link href="/account/hostels/new">
          <Button size="md">
            <PlusCircle className="h-4 w-4" />
            Add New Hostel
          </Button>
        </Link>
        <Link href="/account/booking-requests">
          <Button variant="outline" size="md">
            <Calendar className="h-4 w-4" />
            Booking Requests
            {pendingRequests.length > 0 && (
              <span className="ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">
                {pendingRequests.length}
              </span>
            )}
          </Button>
        </Link>
      </div>

      {/* My Listings */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">My Hostels</h2>
          <Link
            href="/account/hostels"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Manage all →
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-zinc-300 py-10 text-center">
            <Building2 className="mx-auto h-8 w-8 text-zinc-300" />
            <p className="mt-3 text-sm text-zinc-500">No hostels yet</p>
            <Link href="/account/hostels/new">
              <Button variant="outline" size="sm" className="mt-4">
                Add Your First Hostel
              </Button>
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {listings.map((hostel) => (
              <div
                key={hostel.id}
                className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                    <Building2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">{hostel.name}</p>
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
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success">Active</Badge>
                  <Link
                    href={`/hostels/${hostel.slug}`}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/account/hostels/${hostel.id}/edit`}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
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

      {/* Recent Booking Requests */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">
          Recent Booking Requests
        </h2>
        {pendingRequests.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">No pending requests.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {pendingRequests.slice(0, 5).map((request) => (
              <div
                key={request.id}
                className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-zinc-900">
                    {request.user.fullName}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {request.hostel.name} · Check-in: {request.checkIn} ·{" "}
                    <span className="capitalize">{request.stayType} stay</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      bookingsApi
                        .updateStatus(request.id, "confirmed")
                        .then(() =>
                          setRequests((prev) =>
                            prev.map((r) =>
                              r.id === request.id
                                ? { ...r, status: "confirmed" }
                                : r
                            )
                          )
                        )
                    }
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      bookingsApi
                        .updateStatus(request.id, "cancelled")
                        .then(() =>
                          setRequests((prev) =>
                            prev.map((r) =>
                              r.id === request.id
                                ? { ...r, status: "cancelled" }
                                : r
                            )
                          )
                        )
                    }
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
