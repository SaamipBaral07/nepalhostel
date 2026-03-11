import { Search } from "lucide-react";
import type { HostelSummary } from "@/lib/types";
import { HostelCard } from "./HostelCard";
import { HostelCardSkeleton } from "@/components/ui";

interface HostelGridProps {
  hostels: HostelSummary[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function HostelGrid({
  hostels,
  isLoading = false,
  emptyMessage = "No hostels found.",
}: HostelGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <HostelCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (hostels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
          <Search className="h-7 w-7 text-zinc-400" />
        </div>
        <p className="mt-5 text-lg font-semibold text-zinc-700">
          {emptyMessage}
        </p>
        <p className="mt-1.5 max-w-sm text-sm text-zinc-400">
          Try adjusting your search terms or removing some filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {hostels.map((hostel, i) => (
        <HostelCard key={hostel.id} hostel={hostel} index={i} />
      ))}
    </div>
  );
}
