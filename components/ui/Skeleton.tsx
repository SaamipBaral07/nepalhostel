import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-zinc-100",
        "before:absolute before:inset-0 before:animate-[shimmer_1.8s_infinite]",
        "before:bg-linear-to-r before:from-transparent before:via-white/60 before:to-transparent",
        className
      )}
    />
  );
}

export function HostelCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Image area */}
      <div className="relative aspect-[16/10]">
        <Skeleton className="h-full w-full rounded-none" />
        {/* Fake badge skeletons */}
        <div className="absolute left-3 top-3">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="absolute right-3 top-3">
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        {/* Fake price */}
        <div className="absolute bottom-3 left-3">
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
      {/* Content area */}
      <div className="p-4 pt-3.5 space-y-3">
        <Skeleton className="h-[18px] w-3/4 rounded-md" />
        <Skeleton className="h-3.5 w-1/3 rounded-md" />
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-50">
          <Skeleton className="h-6 w-14 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
          <div className="ml-auto">
            <Skeleton className="h-3.5 w-16 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}