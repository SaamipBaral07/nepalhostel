"use client";

import { useEffect, useState } from "react";
import { hostelsApi } from "@/lib/api/hostels";
import { HostelCard } from "@/components/hostel/HostelCard";
import type { HostelSummary, ApiResponse } from "@/lib/types";

export function FeaturedHostels() {
  const [hostels, setHostels] = useState<HostelSummary[]>([]);

  useEffect(() => {
    hostelsApi
      .featured()
      .then((res: ApiResponse<HostelSummary[]>) => setHostels(res.data))
      .catch(() => {});
  }, []);

  if (hostels.length === 0) return null;

  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {hostels.slice(0, 3).map((hostel, idx) => (
        <HostelCard key={hostel.id} hostel={hostel} index={idx} />
      ))}
    </div>
  );
}
