import Link from "next/link";
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Search,
  Building2,
  Users,
  MapPin,
  Star,
  Sparkles,
} from "lucide-react";
import { FeaturedHostels } from "./FeaturedHostels";
import { HeroSection } from "./HeroSection";
import { CityMarquee } from "./CityMarquee";
import { NearbyHostels } from "./NearbyHostels";

const STATS = [
  { value: "500+", label: "Hostels Listed", icon: Building2 },
  { value: "10K+", label: "Happy Guests", icon: Users },
  { value: "25+", label: "Cities Covered", icon: MapPin },
  { value: "4.6★", label: "Average Rating", icon: Star },
];

export default function Home() {
  return (
    <>
      {/* ══════════ CINEMATIC HERO ══════════ */}
      <HeroSection />

      {/* ══════════ STATS BAR ══════════ */}
      <section className="relative border-b border-zinc-100 bg-white py-12 sm:py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 gap-x-6 px-4 sm:px-6 lg:grid-cols-4 lg:gap-x-8 lg:px-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
                <stat.icon className="h-5.5 w-5.5" />
              </div>
              <p className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ FEATURED HOSTELS ══════════ */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                Hand-picked
              </span>
              <h2 className="mt-4 text-2xl font-extrabold text-zinc-900 sm:text-3xl lg:text-4xl">
                Featured Hostels
              </h2>
              <p className="mt-3 text-zinc-500">
                Hand-picked accommodations across Nepal
              </p>
            </div>
            <Link
              href="/hostels"
              className="hidden items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors sm:flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <FeaturedHostels />

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/hostels"
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600"
            >
              View all hostels <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ BROWSE BY CITY (Marquee) ══════════ */}
      <CityMarquee />

      {/* ══════════ NEARBY HOSTELS ══════════ */}
      <NearbyHostels />

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="bg-zinc-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Simple Process
            </span>
            <h2 className="mt-4 text-2xl font-extrabold text-zinc-900 sm:text-3xl lg:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-zinc-500">
              Book your hostel in 3 simple steps
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Search & Filter",
                desc: "Browse hostels by city, category, and budget. Find the perfect match for your stay.",
                step: "01",
              },
              {
                icon: CheckCircle2,
                title: "Book Instantly",
                desc: "Reserve your bed with a simple booking. Short stay or long stay — your choice.",
                step: "02",
              },
              {
                icon: Shield,
                title: "Stay with Confidence",
                desc: "Verified listings, real reviews, and secure payments. Your comfort is our priority.",
                step: "03",
              },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="group relative rounded-3xl border border-zinc-200/60 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-600/5 hover:border-emerald-200"
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-extrabold text-white shadow-md shadow-emerald-600/30">
                  {item.step}
                </div>

                {/* Connector line (between cards on desktop) */}
                {idx < 2 && (
                  <div className="absolute -right-4 top-1/2 hidden h-px w-8 bg-zinc-200 sm:block" />
                )}

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-lg font-bold text-zinc-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="relative overflow-hidden bg-zinc-950 py-24 sm:py-28">
        {/* Background effects */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-600/15 via-transparent to-teal-600/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-linear-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-6">
            <Building2 className="h-3.5 w-3.5" />
            For Hostel Owners
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl tracking-tight">
            Own a Hostel?{" "}
            <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              List It for Free
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-400 leading-relaxed">
            Reach thousands of students and travelers across Nepal.
            Manage bookings, track payments, and grow your business.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex h-13 items-center justify-center rounded-2xl bg-emerald-600 px-10 text-base font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]"
            >
              Register as Host
            </Link>
            <Link
              href="/hostels"
              className="inline-flex h-13 items-center justify-center rounded-2xl border border-zinc-700 px-10 text-base font-semibold text-zinc-300 transition-all hover:border-zinc-500 hover:text-white hover:bg-white/5"
            >
              Browse Hostels
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
