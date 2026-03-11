"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Star, Bed, ArrowRight, Users, Building2, Globe, Compass, Heart, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { wishlistApi } from "@/lib/api/wishlist";
import type { HostelSummary } from "@/lib/types";

interface HostelCardProps {
  hostel: HostelSummary;
  index?: number;
  wishlisted?: boolean;
  onWishlistChange?: (hostelId: string, wishlisted: boolean) => void;
}

const categoryConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  boys: { icon: <Users className="h-3 w-3" />, label: "Boys", color: "text-blue-700 bg-blue-50 ring-blue-100" },
  girls: { icon: <Users className="h-3 w-3" />, label: "Girls", color: "text-pink-700 bg-pink-50 ring-pink-100" },
  unisex: { icon: <Building2 className="h-3 w-3" />, label: "Unisex", color: "text-violet-700 bg-violet-50 ring-violet-100" },
  tourist: { icon: <Compass className="h-3 w-3" />, label: "Tourist", color: "text-amber-700 bg-amber-50 ring-amber-100" },
};

export function HostelCard({ hostel, index = 0, wishlisted: initialWishlisted, onWishlistChange }: HostelCardProps) {
  const cat = categoryConfig[hostel.genderCategory] || categoryConfig.unisex;
  const { isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted ?? false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (initialWishlisted !== undefined) setIsWishlisted(initialWishlisted);
  }, [initialWishlisted]);

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated || wishlistLoading) return;
    setWishlistLoading(true);
    try {
      const res = await wishlistApi.toggle(hostel.id);
      setIsWishlisted(res.data.wishlisted);
      onWishlistChange?.(hostel.id, res.data.wishlisted);
    } catch { /* silently fail */ }
    finally { setWishlistLoading(false); }
  };

  return (
    <Link
      href={`/hostels/${hostel.slug}`}
      className="card-enter group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-zinc-900/10 hover:border-emerald-200"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-zinc-100">
        {hostel.primaryImage ? (
          <img
            src={hostel.primaryImage}
            alt={hostel.name}
            className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-95"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50">
            <div className="text-center">
              <Building2 className="mx-auto h-10 w-10 text-emerald-300" />
              <p className="mt-2 text-xs font-medium text-emerald-600/60">No photo yet</p>
            </div>
          </div>
        )}

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />

        {/* Top badges row */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
          {hostel.isFeatured && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold tracking-wide text-white shadow-lg backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              FEATURED
            </span>
          )}

          <div className="ml-auto flex items-center gap-1.5">
            {isAuthenticated && (
              <button
                onClick={handleWishlistClick}
                disabled={wishlistLoading}
                className={`flex h-8 w-8 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-all ${
                  isWishlisted
                    ? "bg-rose-500 text-white hover:bg-rose-600"
                    : "bg-white/90 text-zinc-600 hover:bg-white hover:text-rose-500"
                }`}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                {wishlistLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Heart className={`h-3.5 w-3.5 ${isWishlisted ? "fill-current" : ""}`} />
                )}
              </button>
            )}
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg ring-1 ${cat.color}`}>
              {cat.icon}
              {cat.label}
            </span>
          </div>
        </div>

        {/* Price tag — ribbon style anchored to bottom-right */}
        <div className="absolute bottom-0 right-0">
          <div className="relative bg-emerald-600 pl-4 pr-3.5 py-2 rounded-tl-xl shadow-lg">
            {/* Notch */}
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rotate-45 bg-emerald-600" />
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] font-medium text-emerald-200">Rs.</span>
              <span className="text-lg font-extrabold text-white leading-none">
                {hostel.pricePerMonth.toLocaleString()}
              </span>
            </div>
            <div className="text-[10px] font-medium text-emerald-200/80 text-right -mt-0.5">/month</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-tight text-zinc-900 transition-colors group-hover:text-emerald-600 line-clamp-2 flex-1">
            {hostel.name}
          </h3>
          <ArrowRight className="h-5 w-5 shrink-0 text-zinc-300 transition-all duration-500 group-hover:translate-x-1 group-hover:text-emerald-600" />
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-sm text-zinc-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
          <span className="truncate font-medium">{hostel.city}</span>
        </div>

        {/* Stats row */}
        <div className="mt-4 flex items-center gap-2.5 pt-4 border-t border-zinc-100">
          {hostel.rating > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 ring-1 ring-amber-100/50">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-amber-700">
                  {hostel.rating.toFixed(1)}
                </span>
              </div>
              {hostel.reviewCount > 0 && (
                <span className="text-xs text-zinc-400 font-medium">
                  ({hostel.reviewCount})
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 rounded-lg bg-zinc-50 px-2.5 py-1.5 ring-1 ring-zinc-100/50">
            <Bed className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-sm font-bold text-zinc-700">
              {hostel.availableBeds}
            </span>
            <span className="text-xs text-zinc-500 font-medium">beds</span>
          </div>
        </div>
      </div>

      {/* Hover effect - subtle border glow */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-inset ring-emerald-400/0 transition-all duration-500 group-hover:ring-emerald-400/100 pointer-events-none" />
    </Link>
  );
}
