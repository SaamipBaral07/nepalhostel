import { Suspense } from "react";
import { Search, MapPin, Sparkles } from "lucide-react";
import { HostelFilters } from "@/components/hostel/HostelFilters";
import { HostelListContent } from "./HostelListContent";
import { HostelCardSkeleton } from "@/components/ui";
import { NearbyHostelsSection } from "./NearbyHostelsSection";

export const metadata = {
  title: "Browse Hostels | नेपाल Hostel Finder",
  description: "Find and compare hostels across Nepal by city, category, and budget.",
};

export default function HostelsPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 via-white to-white">
      {/* Hero Banner */}
      <div className="relative h-120 sm:h-135 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/pokhara.jpg"
            alt="Hostels in Nepal"
            className="h-full w-full object-cover object-center"
          />
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-zinc-900/80 via-zinc-900/50 to-zinc-900/90" />
          <div className="absolute inset-0 bg-linear-to-r from-emerald-950/30 via-transparent to-cyan-950/20" />
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Hero Content */}
        <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-semibold tracking-widest text-emerald-300 uppercase">
              Explore Nepal
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Find Your Perfect
            <span className="block mt-1 bg-linear-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
              Hostel Stay
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Verified hostels across Nepal — from the mountains of Pokhara to
            the streets of Kathmandu.
          </p>

          {/* Stats row */}
          <div className="mt-8 flex items-center gap-6 sm:gap-10">
            <div className="text-center">
              <p className="text-2xl font-bold text-white sm:text-3xl">50+</p>
              <p className="mt-0.5 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                Hostels
              </p>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white sm:text-3xl">10+</p>
              <p className="mt-0.5 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                Cities
              </p>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white sm:text-3xl">4.5</p>
              <p className="mt-0.5 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                Avg Rating
              </p>
            </div>
          </div>
        </div>

        {/* Bottom fade into content */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-zinc-50 to-transparent" />
      </div>

      {/* Content area */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters Section */}
        <div className="-mt-20 relative z-10">
          <Suspense fallback={null}>
            <HostelFilters />
          </Suspense>
        </div>

        {/* Results Section */}
        <div className="mt-8">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <HostelCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <HostelListContent />
          </Suspense>
        </div>

        {/* Nearby Hostels */}
        <NearbyHostelsSection />
      </div>
    </div>
  );
}
