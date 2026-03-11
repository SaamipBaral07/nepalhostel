"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Search, X, MapPin, DollarSign, Bed, Wifi, ChevronDown, SlidersHorizontal } from "lucide-react";
import { GENDER_CATEGORIES } from "@/lib/constants";
import { hostelsApi } from "@/lib/api/hostels";
import type { City } from "@/lib/types";

const PRICE_RANGES = [
  { label: "Under NPR 5,000", min: 0, max: 5000 },
  { label: "NPR 5,000 - 10,000", min: 5000, max: 10000 },
  { label: "NPR 10,000 - 15,000", min: 10000, max: 15000 },
  { label: "NPR 15,000 - 20,000", min: 15000, max: 20000 },
  { label: "Above NPR 20,000", min: 20000, max: 999999 },
];

const BED_OPTIONS = [
  { label: "1-5 beds", min: 1, max: 5 },
  { label: "6-10 beds", min: 6, max: 10 },
  { label: "11-20 beds", min: 11, max: 20 },
  { label: "20+ beds", min: 20, max: 999 },
];

// Emoji mapping for common amenities
const AMENITY_ICONS: Record<string, string> = {
  "Wi-Fi": "📶",
  "Parking": "🅿️",
  "Laundry": "🧺",
  "Kitchen": "🍳",
  "AC": "❄️",
  "Hot Water": "🚿",
  "TV": "📺",
  "Gym": "💪",
  "Security": "🔒",
  "Elevator": "🛗",
};

export function HostelFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cities, setCities] = useState<City[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Fetch cities and amenities from backend
  useEffect(() => {
    hostelsApi
      .getCities()
      .then((res) => setCities(res.data))
      .catch((err) => {
        console.error("Failed to fetch cities:", err);
      });
    
    hostelsApi
      .getAmenities()
      .then((res) => {
        setAmenities(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch amenities:", err);
        setAmenities([]);
      });
  }, []);

  // Load amenities from URL
  useEffect(() => {
    const amenitiesParam = searchParams.get("amenities");
    if (amenitiesParam) {
      setSelectedAmenities(amenitiesParam.split(","));
    } else {
      setSelectedAmenities([]);
    }
  }, [searchParams]);

  const currentCity = searchParams.get("city") || "";
  const currentGender = searchParams.get("gender") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentMinBeds = searchParams.get("minBeds") || "";
  const currentMaxBeds = searchParams.get("maxBeds") || "";

  const applyFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/hostels?${params.toString()}`);
    },
    [router, searchParams]
  );

  const applyMultipleFilters = useCallback(
    (filters: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.delete("page");
      router.push(`/hostels?${params.toString()}`);
    },
    [router, searchParams]
  );

  const toggleAmenity = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    
    setSelectedAmenities(newAmenities);
    applyFilter("amenities", newAmenities.join(","));
  };

  const setPriceRange = (min: number, max: number) => {
    applyMultipleFilters({
      minPrice: min.toString(),
      maxPrice: max === 999999 ? "" : max.toString(),
    });
  };

  const setBedRange = (min: number, max: number) => {
    applyMultipleFilters({
      minBeds: min.toString(),
      maxBeds: max === 999 ? "" : max.toString(),
    });
  };

  const clearFilters = useCallback(() => {
    setSelectedAmenities([]);
    router.push("/hostels");
  }, [router]);

  const hasFilters = currentCity || currentGender || currentSearch || currentMinPrice || currentMaxPrice || currentMinBeds || currentMaxBeds || selectedAmenities.length > 0;
  const activeCount = [
    currentCity,
    currentGender,
    currentSearch,
    currentMinPrice || currentMaxPrice,
    currentMinBeds || currentMaxBeds,
    selectedAmenities.length > 0 ? "amenities" : "",
  ].filter(Boolean).length;

  // Check if advanced filters are active
  const hasAdvancedFilters = currentMinPrice || currentMaxPrice || currentMinBeds || currentMaxBeds || selectedAmenities.length > 0;

  useEffect(() => {
    if (hasAdvancedFilters) {
      setShowAdvanced(true);
    }
  }, [hasAdvancedFilters]);

  return (
    <div className="relative rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/5">
      {/* Main Filters Section */}
      <div className="p-6">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, area, or keyword..."
            defaultValue={currentSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilter("search", (e.target as HTMLInputElement).value);
              }
            }}
            className="h-14 w-full rounded-xl border-2 border-zinc-200 bg-white pl-12 pr-4 text-[15px] text-zinc-900 placeholder:text-zinc-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        {/* Primary Filters */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {/* City select */}
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <select
              value={currentCity}
              onChange={(e) => applyFilter("city", e.target.value)}
              className={`h-11 appearance-none rounded-xl border-2 pl-10 pr-10 text-sm font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/10 ${
                currentCity
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2">
            {GENDER_CATEGORIES.map((cat) => {
              const isActive = currentGender === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => applyFilter("gender", isActive ? "" : cat.value)}
                  className={`inline-flex h-11 items-center gap-2 rounded-xl border-2 px-4 text-sm font-semibold transition-all ${
                    isActive
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`ml-auto inline-flex h-11 items-center gap-2 rounded-xl border-2 px-4 text-sm font-semibold transition-all ${
              showAdvanced || hasAdvancedFilters
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            More Filters
            {hasAdvancedFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
                {activeCount}
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
            />
          </button>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex h-11 items-center gap-2 rounded-xl border-2 border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-600 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
            >
              <X className="h-4 w-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Section */}
      {showAdvanced && (
        <div className="border-t border-zinc-100 bg-zinc-50/50 p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Price Range */}
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                Price Range (Monthly)
              </div>
              <div className="space-y-2">
                {PRICE_RANGES.map((range) => {
                  const isActive =
                    currentMinPrice === range.min.toString() &&
                    (range.max === 999999
                      ? !currentMaxPrice
                      : currentMaxPrice === range.max.toString());
                  return (
                    <button
                      key={range.label}
                      onClick={() => setPriceRange(range.min, range.max)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                      }`}
                    >
                      <span>{range.label}</span>
                      {isActive && (
                        <div className="h-2 w-2 rounded-full bg-emerald-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bed Count */}
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <Bed className="h-4 w-4 text-emerald-600" />
                Number of Beds
              </div>
              <div className="space-y-2">
                {BED_OPTIONS.map((option) => {
                  const isActive =
                    currentMinBeds === option.min.toString() &&
                    (option.max === 999
                      ? !currentMaxBeds
                      : currentMaxBeds === option.max.toString());
                  return (
                    <button
                      key={option.label}
                      onClick={() => setBedRange(option.min, option.max)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                      }`}
                    >
                      <span>{option.label}</span>
                      {isActive && (
                        <div className="h-2 w-2 rounded-full bg-emerald-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-700">
                <Wifi className="h-4 w-4 text-emerald-600" />
                Amenities
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {amenities.length === 0 ? (
                  <p className="text-sm text-zinc-500 py-4 text-center">
                    No amenities available
                  </p>
                ) : (
                  amenities.map((amenity) => {
                    const isActive = selectedAmenities.includes(amenity);
                    const icon = AMENITY_ICONS[amenity] || "✨";
                    return (
                      <button
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                        }`}
                      >
                        <span className="text-base">{icon}</span>
                        <span className="flex-1 text-left">{amenity}</span>
                        {isActive && (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600">
                            <svg
                              className="h-3 w-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasAdvancedFilters && (
            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-emerald-700">
                    Active Filters:
                  </span>
                  {(currentMinPrice || currentMaxPrice) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-700">
                      Price: NPR {currentMinPrice || "0"} - {currentMaxPrice || "∞"}
                    </span>
                  )}
                  {(currentMinBeds || currentMaxBeds) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-700">
                      Beds: {currentMinBeds || "1"}+ beds
                    </span>
                  )}
                  {selectedAmenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-700"
                    >
                      {amenity}
                      <button
                        onClick={() => toggleAmenity(amenity)}
                        className="ml-1 hover:text-emerald-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
