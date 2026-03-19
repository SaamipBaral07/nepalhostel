"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, CalendarDays, Shield, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { bookingsApi } from "@/lib/api/bookings";
import { Button, Input, Select } from "@/components/ui";
import { STAY_TYPES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { Hostel } from "@/lib/types";

interface BookingSidebarProps {
  hostel: Hostel;
}

export function BookingSidebar({ hostel }: BookingSidebarProps) {
  const { isAuthenticated, isHost, user } = useAuth();
  const router = useRouter();

  const [stayType, setStayType] = useState<"short" | "long">("short");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "esewa">("stripe");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submitEsewaForm = (formUrl: string, formData: Record<string, string>) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = formUrl;

    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handleBook = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const bookingRes = await bookingsApi.create({
        hostelId: hostel.id,
        stayType,
        checkIn,
        checkOut,
      });

      const booking = bookingRes.data;

      if (paymentMethod === "stripe") {
        try {
          const paymentRes = await bookingsApi.createCheckoutSession(booking.id);
          if (paymentRes.data.checkoutUrl) {
            window.location.href = paymentRes.data.checkoutUrl;
            return;
          }
        } catch {
          // Stripe not configured — keep booking created and show success state
        }
      } else {
        const paymentRes = await bookingsApi.initiateEsewaPayment(booking.id);
        submitEsewaForm(paymentRes.data.formUrl, paymentRes.data.formData);
        return;
      }

      setSuccess(true);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Failed to create booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="sticky top-24 rounded-2xl border border-emerald-200 bg-linear-to-b from-emerald-50 to-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <span className="text-2xl">✅</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-emerald-800">
          Booking Created!
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-emerald-700/80">
          Your booking is pending confirmation from the host. You&apos;ll be notified once it&apos;s confirmed.
        </p>
        <Button
          className="mt-5 w-full"
          onClick={() => router.push("/account/bookings")}
        >
          View My Bookings
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="sticky top-24 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
      {/* Price header with gradient */}
      <div className="relative bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-6 py-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_70%)]" />
        <p className="relative text-xs font-medium tracking-widest text-zinc-400 uppercase">Starting from</p>
        <div className="relative mt-2">
          <span className="text-3xl font-bold text-white">
            {formatPrice(hostel.pricePerNight)}
          </span>
          <span className="ml-1 text-zinc-400">/night</span>
        </div>
        <p className="relative mt-1.5 text-sm text-zinc-500">
          or <span className="text-zinc-300">{formatPrice(hostel.pricePerMonth)}</span>/month
        </p>
      </div>

      {/* Info rows */}
      <div className="space-y-0 divide-y divide-zinc-100 px-6">
        <div className="flex items-center justify-between py-3.5 text-sm">
          <span className="flex items-center gap-2 text-zinc-500">
            <Users className="h-4 w-4 text-zinc-400" />
            Available Beds
          </span>
          <span className="font-semibold text-zinc-900">
            <span className="text-emerald-600">{hostel.availableBeds}</span> / {hostel.totalBeds}
          </span>
        </div>
        <div className="flex items-center justify-between py-3.5 text-sm">
          <span className="flex items-center gap-2 text-zinc-500">
            <Shield className="h-4 w-4 text-zinc-400" />
            Category
          </span>
          <span className="font-semibold capitalize text-zinc-900">
            {hostel.genderCategory}
          </span>
        </div>
        <div className="flex items-center justify-between py-3.5 text-sm">
          <span className="flex items-center gap-2 text-zinc-500">
            <CalendarDays className="h-4 w-4 text-zinc-400" />
            Hosted by
          </span>
          <span className="font-semibold text-zinc-900">
            {hostel.host.fullName}
          </span>
        </div>
      </div>

      {/* Booking Form */}
      <div className="border-t border-zinc-100 px-6 pb-6 pt-5">
        {isHost ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-center">
            <p className="text-sm font-semibold text-amber-800">
              Hosts cannot book hostels
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-amber-600">
              Switch to a guest account to make bookings.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Select
              id="stayType"
              label="Stay Type"
              value={stayType}
              onChange={(e) => setStayType(e.target.value as "short" | "long")}
              options={STAY_TYPES.map((s) => ({
                value: s.value,
                label: `${s.label} — ${s.description}`,
              }))}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                id="checkIn"
                label="Check-in"
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
              <Input
                id="checkOut"
                label="Check-out"
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <div className="rounded-lg bg-zinc-50 px-3.5 py-2.5">
              {stayType === "short" ? (
                <p className="text-xs leading-relaxed text-zinc-500">
                  <span className="font-medium text-zinc-700">Short stay:</span> Full payment of{" "}
                  <span className="font-semibold text-emerald-600">{formatPrice(hostel.pricePerNight)}/night</span> required at checkout.
                </p>
              ) : (
                <p className="text-xs leading-relaxed text-zinc-500">
                  <span className="font-medium text-zinc-700">Long stay:</span> Advance payment required. Monthly rate:{" "}
                  <span className="font-semibold text-emerald-600">{formatPrice(hostel.pricePerMonth)}/month</span>.
                </p>
              )}
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-3.5">
              <p className="mb-2 text-xs font-semibold tracking-wide text-zinc-600 uppercase">
                Select Payment Method
              </p>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-zinc-200 px-3 py-2.5 text-sm hover:border-emerald-300 hover:bg-emerald-50/40">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === "stripe"}
                    onChange={() => setPaymentMethod("stripe")}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-zinc-900">Pay with Stripe 💳</p>
                    <p className="text-xs text-zinc-500">Host price in NPR is converted to USD for Stripe checkout.</p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-zinc-200 px-3 py-2.5 text-sm hover:border-emerald-300 hover:bg-emerald-50/40">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="esewa"
                    checked={paymentMethod === "esewa"}
                    onChange={() => setPaymentMethod("esewa")}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-zinc-900">Pay with eSewa 🇳🇵</p>
                    <p className="text-xs text-zinc-500">eSewa supports NPR payments only.</p>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
                {error}
              </div>
            )}

            <Button
              className={`w-full ${hostel.availableBeds > 0 && isAuthenticated ? "pulse-glow" : ""}`}
              size="lg"
              onClick={handleBook}
              isLoading={isSubmitting}
              disabled={hostel.availableBeds === 0}
            >
              {hostel.availableBeds === 0
                ? "No Beds Available"
                : isAuthenticated
                  ? "Book Now"
                  : "Login to Book"}
            </Button>

            {!isAuthenticated && (
              <p className="text-center text-xs text-zinc-400">
                You need to{" "}
                <span className="font-medium text-emerald-600 cursor-pointer hover:underline" onClick={() => router.push("/login")}>
                  login
                </span>{" "}
                to make a booking
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
