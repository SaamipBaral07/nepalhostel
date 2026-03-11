"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Trash2,
  Search,
  MapPin,
  Star,
  Bed,
  Building2,
  ChevronRight,
  Loader2,
  ArrowRight,
  LogIn,
  Compass,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { wishlistApi } from "@/lib/api/wishlist";
import type { WishlistItem, ApiError } from "@/lib/types";

const categoryConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  boys: { icon: <Users className="h-3 w-3" />, label: "Boys", color: "text-blue-700 bg-blue-50 ring-blue-100" },
  girls: { icon: <Users className="h-3 w-3" />, label: "Girls", color: "text-pink-700 bg-pink-50 ring-pink-100" },
  unisex: { icon: <Building2 className="h-3 w-3" />, label: "Unisex", color: "text-violet-700 bg-violet-50 ring-violet-100" },
  tourist: { icon: <Compass className="h-3 w-3" />, label: "Tourist", color: "text-amber-700 bg-amber-50 ring-amber-100" },
};

export default function WishlistPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    loadWishlist();
  }, [isAuthenticated, authLoading]);

  const loadWishlist = async () => {
    try {
      const res = await wishlistApi.list();
      setItems(res.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (hostelId: string) => {
    setRemovingId(hostelId);
    try {
      await wishlistApi.toggle(hostelId);
      setItems((prev) => prev.filter((item) => item.hostel.id !== hostelId));
    } catch {
      // silently fail
    } finally {
      setRemovingId(null);
    }
  };

  const filtered = items.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.hostel.name.toLowerCase().includes(q) ||
      item.hostel.city.toLowerCase().includes(q)
    );
  });

  // Not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
            <Heart className="h-10 w-10 text-zinc-300" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900">Sign in to see your wishlist</h2>
          <p className="mt-3 text-zinc-500 leading-relaxed">
            Save your favorite hostels and access them from any device. Create an account or sign in to get started.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:-translate-y-0.5"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50"
            >
              Create Account
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-950 py-20 sm:py-28">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-rose-600/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-rose-600/5 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="transition-colors hover:text-emerald-400">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-zinc-400">Wishlist</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-400 ring-1 ring-rose-500/20 mb-6">
                <Heart className="h-3.5 w-3.5" />
                Your Favorites
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Saved{" "}
                <span className="bg-linear-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                  Hostels
                </span>
              </h1>
              <p className="mt-4 text-lg text-zinc-400">
                {items.length > 0
                  ? `You have ${items.length} hostel${items.length === 1 ? "" : "s"} saved to your wishlist.`
                  : "Hostels you save will appear here."}
              </p>
            </div>

            {items.length > 0 && (
              <div className="relative shrink-0 sm:w-72">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search saved hostels..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 backdrop-blur-sm transition-all focus:border-white/20 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white/20"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="mt-4 text-sm text-zinc-500">Loading your wishlist...</p>
          </div>
        ) : items.length === 0 ? (
          <EmptyWishlist />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Search className="h-12 w-12 text-zinc-200" />
            <h3 className="mt-4 text-lg font-semibold text-zinc-900">No matches found</h3>
            <p className="mt-2 text-sm text-zinc-500">
              Try a different search term or{" "}
              <button onClick={() => setSearch("")} className="text-emerald-600 font-medium hover:underline">
                clear search
              </button>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, idx) => (
              <WishlistCard
                key={item.id}
                item={item}
                index={idx}
                removing={removingId === item.hostel.id}
                onRemove={() => handleRemove(item.hostel.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function WishlistCard({
  item,
  index,
  removing,
  onRemove,
}: {
  item: WishlistItem;
  index: number;
  removing: boolean;
  onRemove: () => void;
}) {
  const { hostel } = item;
  const cat = categoryConfig[hostel.genderCategory] || categoryConfig.unisex;

  return (
    <div
      className="card-enter group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-zinc-900/10 hover:border-emerald-200"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Image */}
      <Link href={`/hostels/${hostel.slug}`} className="relative aspect-4/3 overflow-hidden bg-zinc-100">
        {hostel.primaryImage ? (
          <img
            src={hostel.primaryImage}
            alt={hostel.name}
            className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-95"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50">
            <Building2 className="h-10 w-10 text-emerald-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Category badge */}
        <div className="absolute left-3 top-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg ring-1 ${cat.color}`}>
            {cat.icon}
            {cat.label}
          </span>
        </div>

        {/* Price ribbon */}
        <div className="absolute bottom-0 right-0">
          <div className="relative bg-emerald-600 pl-4 pr-3.5 py-2 rounded-tl-xl shadow-lg">
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
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/hostels/${hostel.slug}`} className="flex-1">
            <h3 className="text-lg font-bold leading-tight text-zinc-900 transition-colors group-hover:text-emerald-600 line-clamp-2">
              {hostel.name}
            </h3>
          </Link>
          <button
            onClick={onRemove}
            disabled={removing}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-500 disabled:opacity-50"
            title="Remove from wishlist"
          >
            {removing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
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
                <span className="text-sm font-bold text-amber-700">{hostel.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-zinc-400">
                ({hostel.reviewCount})
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 ml-auto">
            <Bed className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-sm text-zinc-500">
              <span className="font-semibold text-zinc-700">{hostel.availableBeds}</span> beds
            </span>
          </div>
        </div>

        {/* View button */}
        <Link
          href={`/hostels/${hostel.slug}`}
          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100 hover:border-emerald-300"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-50 ring-8 ring-zinc-50/80">
        <Heart className="h-12 w-12 text-zinc-200" />
      </div>
      <h3 className="text-xl font-bold text-zinc-900">Your wishlist is empty</h3>
      <p className="mt-3 max-w-sm text-center text-zinc-500 leading-relaxed">
        Start exploring hostels and tap the heart icon to save your favorites here for easy access later.
      </p>
      <Link
        href="/hostels"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:-translate-y-0.5"
      >
        <Search className="h-4 w-4" />
        Browse Hostels
      </Link>
    </div>
  );
}
