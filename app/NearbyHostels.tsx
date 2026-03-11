"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Navigation,
  Loader2,
  MapPin,
  Star,
  Bed,
  ArrowRight,
  Building2,
  LocateFixed,
  AlertCircle,
} from "lucide-react";
import { hostelsApi } from "@/lib/api/hostels";
import type { HostelSummary, ApiResponse } from "@/lib/types";

type GeoState =
  | { status: "idle" }
  | { status: "requesting" }
  | { status: "loading"; lat: number; lng: number }
  | { status: "success"; lat: number; lng: number; hostels: HostelSummary[] }
  | { status: "denied" }
  | { status: "error"; message: string };

export function NearbyHostels() {
  const [state, setState] = useState<GeoState>({ status: "idle" });
  const [radius, setRadius] = useState(25);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ status: "error", message: "Geolocation is not supported by your browser." });
      return;
    }

    setState({ status: "requesting" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setState({ status: "loading", lat, lng });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setState({ status: "denied" });
        } else {
          setState({ status: "error", message: "Unable to retrieve your location." });
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Fetch nearby hostels whenever we have coordinates
  useEffect(() => {
    if (state.status !== "loading") return;

    hostelsApi
      .nearby(state.lat, state.lng, radius)
      .then((res: ApiResponse<HostelSummary[]>) => {
        setState({
          status: "success",
          lat: state.lat,
          lng: state.lng,
          hostels: res.data,
        });
      })
      .catch(() => {
        setState({ status: "error", message: "Failed to fetch nearby hostels." });
      });
  }, [state.status, state.status === "loading" ? state.lat : null, radius]);

  // Re-fetch when radius changes while we already have coords
  const refetch = useCallback(
    (newRadius: number) => {
      setRadius(newRadius);
      if (state.status === "success") {
        setState({ status: "loading", lat: state.lat, lng: state.lng });
      }
    },
    [state]
  );

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <Navigation className="h-3.5 w-3.5" />
              Nearby
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-zinc-900 sm:text-3xl lg:text-4xl">
              Hostels Near You
            </h2>
            <p className="mt-3 text-zinc-500">
              Discover hostels closest to your current location
            </p>
          </div>

          {state.status === "success" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-500">Radius:</span>
              {[10, 25, 50, 100].map((r) => (
                <button
                  key={r}
                  onClick={() => refetch(r)}
                  className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                    radius === r
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-10">
          {/* ── Idle: CTA to enable location ── */}
          {state.status === "idle" && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200/60 bg-linear-to-br from-zinc-50 to-white px-6 py-20 text-center">
              <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-sm">
                <Navigation className="h-9 w-9" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-zinc-900">
                Find hostels near you
              </h3>
              <p className="mt-2 max-w-md text-sm text-zinc-500 leading-relaxed">
                Allow location access to discover hostels close to your current
                position. We&apos;ll show you the nearest options sorted by distance.
              </p>
              <button
                onClick={requestLocation}
                className="mt-8 inline-flex items-center gap-2.5 rounded-2xl bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-600/30 active:scale-[0.98]"
              >
                <LocateFixed className="h-4.5 w-4.5" />
                Enable Location
              </button>
            </div>
          )}

          {/* ── Requesting / Loading ── */}
          {(state.status === "requesting" || state.status === "loading") && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50/50 px-6 py-16 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
              <p className="mt-4 text-sm font-medium text-zinc-600">
                {state.status === "requesting"
                  ? "Requesting your location..."
                  : "Finding nearby hostels..."}
              </p>
            </div>
          )}

          {/* ── Denied ── */}
          {state.status === "denied" && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-200 bg-amber-50/50 px-6 py-12 text-center">
              <AlertCircle className="h-10 w-10 text-amber-500" />
              <h3 className="mt-4 text-base font-semibold text-zinc-900">
                Location access denied
              </h3>
              <p className="mt-2 max-w-md text-sm text-zinc-500">
                Please enable location access in your browser settings to
                discover nearby hostels.
              </p>
            </div>
          )}

          {/* ── Error ── */}
          {state.status === "error" && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 px-6 py-12 text-center">
              <AlertCircle className="h-10 w-10 text-red-400" />
              <p className="mt-4 text-sm font-medium text-red-600">
                {state.message}
              </p>
              <button
                onClick={requestLocation}
                className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                Try again
              </button>
            </div>
          )}

          {/* ── Success: show results ── */}
          {state.status === "success" && (
            <>
              {state.hostels.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50/50 px-6 py-12 text-center">
                  <MapPin className="h-10 w-10 text-zinc-300" />
                  <h3 className="mt-4 text-base font-semibold text-zinc-900">
                    No hostels found nearby
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500">
                    Try increasing the radius to find hostels further away.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {state.hostels.map((hostel, idx) => (
                    <NearbyHostelCard key={hostel.id} hostel={hostel} index={idx} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function NearbyHostelCard({ hostel, index }: { hostel: HostelSummary; index: number }) {
  const distanceLabel =
    hostel.distance !== undefined
      ? hostel.distance < 1
        ? `${Math.round(hostel.distance * 1000)}m away`
        : `${hostel.distance.toFixed(1)} km away`
      : null;

  return (
    <Link
      href={`/hostels/${hostel.slug}`}
      className="card-enter group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-200"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-16/10 overflow-hidden bg-zinc-100">
        {hostel.primaryImage ? (
          <img
            src={hostel.primaryImage}
            alt={hostel.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-50 to-teal-50">
            <Building2 className="h-10 w-10 text-emerald-300" />
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

        {/* Distance badge */}
        {distanceLabel && (
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-lg backdrop-blur-sm">
            <Navigation className="h-3 w-3 fill-emerald-600 text-emerald-600" />
            {distanceLabel}
          </div>
        )}

        {/* Price */}
        <div className="absolute bottom-3 right-3 rounded-xl bg-emerald-600/95 px-3 py-1.5 text-sm font-bold text-white shadow-lg backdrop-blur-sm">
          Rs. {Number(hostel.pricePerMonth).toLocaleString()}<span className="text-xs font-normal text-emerald-200">/mo</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-zinc-900 leading-tight line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {hostel.name}
          </h3>
          <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-600" />
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-zinc-500">
          <MapPin className="h-3.5 w-3.5 text-zinc-400" />
          <span className="truncate">{hostel.city}</span>
        </div>

        <div className="mt-3 flex items-center gap-2 pt-3 border-t border-zinc-100">
          {hostel.rating > 0 && (
            <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {hostel.rating.toFixed(1)}
            </div>
          )}
          <div className="flex items-center gap-1 rounded-md bg-zinc-50 px-2 py-1 text-xs font-semibold text-zinc-600">
            <Bed className="h-3 w-3" />
            {hostel.availableBeds} beds
          </div>
        </div>
      </div>
    </Link>
  );
}
