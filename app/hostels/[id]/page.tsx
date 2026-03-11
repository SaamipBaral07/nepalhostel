import {
  MapPin,
  Star,
  Wifi,
  Droplets,
  Car,
  Shield,
  Coffee,
  BookOpen,
  ArrowLeft,
  Bed,
  User,
  CheckCircle2,
  ImageIcon,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { serverFetch } from "@/lib/api/server";
import { BookingSidebar } from "./BookingSidebar";
import { ReviewSection } from "./ReviewSection";
import { formatPrice } from "@/lib/utils";
import type { ApiResponse, Hostel } from "@/lib/types";

export const metadata = {
  title: "Hostel Detail | नेपाल Hostel Finder",
};

const amenityIcons: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi className="h-5 w-5" />,
  "Hot Water": <Droplets className="h-5 w-5" />,
  Parking: <Car className="h-5 w-5" />,
  CCTV: <Shield className="h-5 w-5" />,
  Kitchen: <Coffee className="h-5 w-5" />,
  "Study Room": <BookOpen className="h-5 w-5" />,
};

const categoryStyle: Record<string, string> = {
  boys: "bg-blue-50 text-blue-700 border-blue-100",
  girls: "bg-pink-50 text-pink-700 border-pink-100",
  unisex: "bg-violet-50 text-violet-700 border-violet-100",
  tourist: "bg-amber-50 text-amber-700 border-amber-100",
};

export default async function HostelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await serverFetch<ApiResponse<Hostel>>(`/hostels/${id}/`);
  const hostel = response?.data;

  if (!hostel) {
    notFound();
  }

  const catStyle = categoryStyle[hostel.genderCategory] || categoryStyle.unisex;

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50/80 to-white pt-16">
      {/* Back navigation bar */}
      <div className="border-b border-zinc-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/hostels"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 -ml-3 text-sm font-medium text-zinc-600 transition-all hover:bg-emerald-50 hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hostels
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            {hostel.images && hostel.images.length > 0 ? (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {/* Hero image */}
                <div className="col-span-4 sm:col-span-2 sm:row-span-2 aspect-4/3 overflow-hidden rounded-2xl sm:aspect-auto sm:h-full">
                  <img
                    src={hostel.images[0].url}
                    alt={hostel.images[0].altText || hostel.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                {/* Side images */}
                {hostel.images.slice(1, 3).map((img) => (
                  <div
                    key={img.id}
                    className="col-span-2 aspect-4/3 overflow-hidden rounded-xl"
                  >
                    <img
                      src={img.url}
                      alt={img.altText || hostel.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ))}
                {/* If only 1 image, fill remaining */}
                {hostel.images.length === 1 && (
                  <>
                    <div className="col-span-2 aspect-4/3 overflow-hidden rounded-xl bg-linear-to-br from-zinc-100 to-zinc-50 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-zinc-300" />
                    </div>
                    <div className="col-span-2 aspect-4/3 overflow-hidden rounded-xl bg-linear-to-br from-zinc-100 to-zinc-50 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-zinc-300" />
                    </div>
                  </>
                )}
                {hostel.images.length === 2 && (
                  <div className="col-span-2 aspect-4/3 overflow-hidden rounded-xl bg-linear-to-br from-zinc-100 to-zinc-50 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-zinc-300" />
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <div className="col-span-4 sm:col-span-2 sm:row-span-2 overflow-hidden rounded-2xl bg-linear-to-br from-emerald-100 via-teal-50 to-cyan-100 flex items-center justify-center aspect-4/3 sm:aspect-auto sm:min-h-80">
                  <div className="text-center">
                    <Building2 className="mx-auto h-12 w-12 text-emerald-400/50 mb-3" />
                    <p className="text-sm font-medium text-emerald-700/40">No photos available</p>
                  </div>
                </div>
                <div className="col-span-2 aspect-4/3 overflow-hidden rounded-xl bg-linear-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-emerald-300/40" />
                </div>
                <div className="col-span-2 aspect-4/3 overflow-hidden rounded-xl bg-linear-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-emerald-300/40" />
                </div>
              </div>
            )}

            {/* Header section */}
            <div className="mt-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-3">
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                    {hostel.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-zinc-400" />
                      {hostel.address}
                    </span>
                    {hostel.rating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-zinc-700">{hostel.rating}</span>
                        <span className="text-zinc-400">({hostel.reviewCount} reviews)</span>
                      </span>
                    )}
                  </div>
                </div>
                <span className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${catStyle}`}>
                  {hostel.genderCategory.charAt(0).toUpperCase() +
                    hostel.genderCategory.slice(1)}
                </span>
              </div>

              {/* Quick stats row */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3.5 text-center">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Per Night</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900">{formatPrice(hostel.pricePerNight)}</p>
                </div>
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3.5 text-center">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Per Month</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900">{formatPrice(hostel.pricePerMonth)}</p>
                </div>
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3.5 text-center">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Beds</p>
                  <p className="mt-1 text-lg font-bold text-zinc-900">
                    <span className="text-emerald-600">{hostel.availableBeds}</span>
                    <span className="text-zinc-400 font-normal"> / {hostel.totalBeds}</span>
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3.5 text-center">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Host</p>
                  <p className="mt-1 text-sm font-semibold text-zinc-900 truncate">{hostel.host.fullName}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-9">
              <h2 className="text-lg font-semibold text-zinc-900">
                About this Hostel
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-zinc-600">
                {hostel.description}
              </p>
            </div>

            {/* Amenities */}
            {hostel.amenities && hostel.amenities.length > 0 && (
              <div className="mt-9">
                <h2 className="text-lg font-semibold text-zinc-900">
                  What this place offers
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {hostel.amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-white p-3.5 transition-colors hover:bg-zinc-50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        {amenityIcons[amenity.name] || (
                          <CheckCircle2 className="h-4.5 w-4.5" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-zinc-700">
                        {amenity.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews section */}
            <ReviewSection
              hostelId={hostel.id}
              initialReviews={hostel.reviews || []}
              rating={hostel.rating}
              reviewCount={hostel.reviewCount}
            />
          </div>

          {/* Sidebar — Booking Card */}
          <div className="lg:col-span-1">
            <BookingSidebar hostel={hostel} />
          </div>
        </div>
      </div>
    </div>
  );
}
