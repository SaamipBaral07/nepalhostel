"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { HostelGrid } from "@/components/hostel/HostelGrid";
import { HostelCardSkeleton } from "@/components/ui";
import { hostelsApi } from "@/lib/api/hostels";
import type { HostelSummary, PaginatedResponse, GenderCategory } from "@/lib/types";

export function HostelListContent() {
  const searchParams = useSearchParams();
  const [hostels, setHostels] = useState<HostelSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const city = searchParams.get("city") || undefined;
    const genderCategory = (searchParams.get("gender") || undefined) as GenderCategory | undefined;
    const search = searchParams.get("search") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const minBeds = searchParams.get("minBeds") ? Number(searchParams.get("minBeds")) : undefined;
    const maxBeds = searchParams.get("maxBeds") ? Number(searchParams.get("maxBeds")) : undefined;
    const amenities = searchParams.get("amenities") || undefined;

    setIsLoading(true);
    hostelsApi
      .list({ 
        city, 
        genderCategory, 
        search,
        minPrice,
        maxPrice,
        minBeds,
        maxBeds,
        amenities: amenities ? amenities.split(",") : undefined,
      })
      .then((res: PaginatedResponse<HostelSummary>) => {
        setHostels(res.results);
        setTotal(res.count);
      })
      .catch(() => {
        setHostels([]);
        setTotal(0);
      })
      .finally(() => setIsLoading(false));
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <HostelCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-zinc-600">
          Showing <span className="font-semibold text-zinc-900">{total}</span>{" "}
          hostel{total !== 1 ? "s" : ""}
        </p>
      </div>
      <HostelGrid hostels={hostels} />
    </>
  );
}
