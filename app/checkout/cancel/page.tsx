"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { Suspense } from "react";

function CancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-zinc-900">
          Payment Cancelled
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Your payment was not completed. Your booking is still pending.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {bookingId && (
            <Link href="/account/bookings">
              <Button className="w-full">View My Bookings</Button>
            </Link>
          )}
          <Link href="/hostels">
            <Button variant="outline" className="w-full">
              Browse Hostels
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      }
    >
      <CancelContent />
    </Suspense>
  );
}
