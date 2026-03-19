"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { Suspense } from "react";
import { siteSettingsApi } from "@/lib/api/siteSettings";
import type { SiteSettingsMap } from "@/lib/types";

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const [settings, setSettings] = useState<SiteSettingsMap>({});

  useEffect(() => {
    siteSettingsApi
      .list()
      .then((res) => setSettings(res.data))
      .catch(() => {});
  }, []);

  const setting = (key: string, fallback: string) => {
    const value = settings[key];
    return value && value.trim() ? value : fallback;
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md rounded-xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-zinc-900">
          {setting("checkout.success.title", "Payment Successful!")}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {setting("checkout.success.subtitle", "Your booking has been confirmed and payment received.")}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {bookingId && (
            <Link href={`/account/bookings`}>
              <Button className="w-full">{setting("checkout.success.primary_button", "View My Bookings")}</Button>
            </Link>
          )}
          <Link href="/hostels">
            <Button variant="outline" className="w-full">
              {setting("checkout.success.secondary_button", "Browse More Hostels")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
