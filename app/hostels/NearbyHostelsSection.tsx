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
} from "lucide-react";
import { hostelsApi } from "@/lib/api/hostels";
import type { HostelSummary, ApiResponse } from "@/lib/types";

type GeoState =
  | { status: "idle" }
  | { status: "requesting" }
  | { status: "loading"; lat: number; lng: number }
  | { status: "success"; lat: number; lng: number; hostels: HostelSummary[] }
  | { status: "unavailable" };

export function NearbyHostelsSection() {
  const [state, setState] = useState<GeoState>({ status: "idle" });
  const [radius, setRadius] = useState(25);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ status: "unavailable" });
      return;
    }
    setState({ status: "requesting" });
    navigator.geolocation.getCurrentPosition(
      (pos) => setState({ status: "loading", lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setState({ status: "unavailable" }),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    if (state.status !== "loading") return;
    hostelsApi
      .nearby(state.lat, state.lng, radius)
      .then((res: ApiResponse<HostelSummary[]>) =>
        setState({ status: "success", lat: state.lat, lng: state.lng, hostels: res.data })
      )
      .catch(() => setState({ status: "unavailable" }));
  }, [state.status, state.status === "loading" ? state.lat : null, radius]);

  const changeRadius = useCallback(
    (r: number) => {
      setRadius(r);
      if (state.status === "success") {
        setState({ status: "loading", lat: state.lat, lng: state.lng });
      }
    },
    [state]
  );

  // Don't render anything if location isn't available
  if (state.status === "unavailable") return null;

  return (
    <div className="mt-12 border-t border-zinc-200 pt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Navigation className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Nearby Hostels</h2>
            <p className="text-sm text-zinc-500">Based on your current location</p>
          </div>
        </div>

        {state.status === "success" && (
          <div className="flex items-center gap-1.5">
            {[10, 25, 50, 100].map((r) => (
              <button
                key={r}
                onClick={() => changeRadius(r)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  radius === r
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {r}km
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        {state.status === "idle" && (
          <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-10">
            <button
              onClick={requestLocation}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98]"
            >
              <LocateFixed className="h-4 w-4" />
              Show Nearby Hostels
            </button>
          </div>
        )}

        {(state.status === "requesting" || state.status === "loading") && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <span className="ml-3 text-sm text-zinc-500">
              {state.status === "requesting" ? "Getting your location..." : "Finding nearby hostels..."}
            </span>
          </div>
        )}

        {state.status === "success" && (
          <>
            {state.hostels.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 py-8 text-center">
                <MapPin className="mx-auto h-8 w-8 text-zinc-300" />
                <p className="mt-2 text-sm text-zinc-500">No hostels found within {radius}km. Try a larger radius.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {state.hostels.map((hostel) => (
                  <Link
                    key={hostel.id}
                    href={`/hostels/${hostel.slug}`}
                    className="group flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-3 transition-all hover:border-emerald-200 hover:shadow-md"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                      {hostel.primaryImage ? (
                        <img src={hostel.primaryImage} alt={hostel.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-emerald-50">
                          <Building2 className="h-6 w-6 text-emerald-300" />
                        </div>
                      )}
                      {hostel.distance !== undefined && (
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 px-1 py-0.5 text-center text-[10px] font-semibold text-white backdrop-blur-sm">
                          {hostel.distance < 1
                            ? `${Math.round(hostel.distance * 1000)}m`
                            : `${hostel.distance.toFixed(1)}km`}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-zinc-900 truncate group-hover:text-emerald-600 transition-colors">
                        {hostel.name}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500">
                        <MapPin className="h-3 w-3" />
                        {hostel.city}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        {hostel.rating > 0 && (
                          <span className="flex items-center gap-0.5 text-xs font-medium text-amber-700">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {hostel.rating.toFixed(1)}
                          </span>
                        )}
                        <span className="flex items-center gap-0.5 text-xs text-zinc-500">
                          <Bed className="h-3 w-3" /> {hostel.availableBeds}
                        </span>
                        <span className="ml-auto text-sm font-bold text-emerald-600">
                          Rs. {Number(hostel.pricePerMonth).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 group-hover:text-emerald-500 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
