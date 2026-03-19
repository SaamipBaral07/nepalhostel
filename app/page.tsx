"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
import { siteSettingsApi } from "@/lib/api/siteSettings";
import type { SiteSettingsMap } from "@/lib/types";

const DEFAULT_STATS = [
  {
    value: "500+",
    label: "Hostels Listed",
    icon: Building2,
    valueKey: "home.stats.hostels.value",
    labelKey: "home.stats.hostels.label",
  },
  {
    value: "10K+",
    label: "Happy Guests",
    icon: Users,
    valueKey: "home.stats.guests.value",
    labelKey: "home.stats.guests.label",
  },
  {
    value: "25+",
    label: "Cities Covered",
    icon: MapPin,
    valueKey: "home.stats.cities.value",
    labelKey: "home.stats.cities.label",
  },
  {
    value: "4.8★",
    label: "Average Rating",
    icon: Star,
    valueKey: "home.stats.rating.value",
    labelKey: "home.stats.rating.label",
  },
];

const DEFAULT_STEPS = [
  {
    icon: Search,
    title: "Search & Filter",
    desc: "Browse hostels by city, category, and budget. Find the perfect match for your stay.",
    step: "01",
    titleKey: "home.how.step1.title",
    descKey: "home.how.step1.description",
  },
  {
    icon: CheckCircle2,
    title: "Book Instantly",
    desc: "Reserve your bed with a simple booking. Short stay or long stay — your choice.",
    step: "02",
    titleKey: "home.how.step2.title",
    descKey: "home.how.step2.description",
  },
  {
    icon: Shield,
    title: "Stay with Confidence",
    desc: "Verified listings, real reviews, and secure payments. Your comfort is our priority.",
    step: "03",
    titleKey: "home.how.step3.title",
    descKey: "home.how.step3.description",
  },
];

export default function Home() {
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

  const stats = DEFAULT_STATS.map((item) => ({
    ...item,
    value: setting(item.valueKey, item.value),
    label: setting(item.labelKey, item.label),
  }));

  const howSteps = DEFAULT_STEPS.map((item) => ({
    ...item,
    title: setting(item.titleKey, item.title),
    desc: setting(item.descKey, item.desc),
  }));

  return (
    <>
      {/* ══════════ CINEMATIC HERO ══════════ */}
      <HeroSection
        badgeText={setting("home.hero.badge", "Nepal's #1 Hostel Platform")}
        titleLine1={setting("home.hero.title_line_1", "Find Your Perfect")}
        titleHighlight={setting("home.hero.title_line_2", "Hostel in Nepal")}
        description={setting(
          "home.hero.description",
          "Whether you're a student looking for affordable accommodation or a traveler exploring the Himalayas — we've got you covered."
        )}
        cityPlaceholder={setting("home.hero.city_placeholder", "All Cities")}
        searchButtonText={setting("home.hero.search_button", "Search Hostels")}
        quickLabel={setting("home.hero.quick_label", "Quick:")}
        quickLabels={{
          boys: setting("home.hero.quick_boys", "Boys"),
          girls: setting("home.hero.quick_girls", "Girls"),
          unisex: setting("home.hero.quick_unisex", "Unisex"),
          tourist: setting("home.hero.quick_tourist", "Tourist"),
        }}
      />

      {/* ══════════ STATS BAR ══════════ */}
      <section className="relative border-b border-zinc-100 bg-white py-12 sm:py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 gap-x-6 px-4 sm:px-6 lg:grid-cols-4 lg:gap-x-8 lg:px-8">
          {stats.map((stat) => (
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
                {setting("home.featured.badge", "Hand-picked")}
              </span>
              <h2 className="mt-4 text-2xl font-extrabold text-zinc-900 sm:text-3xl lg:text-4xl">
                {setting("home.featured.title", "Featured Hostels")}
              </h2>
              <p className="mt-3 text-zinc-500">
                {setting("home.featured.subtitle", "Hand-picked accommodations across Nepal")}
              </p>
            </div>
            <Link
              href="/hostels"
              className="hidden items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors sm:flex"
            >
              {setting("home.featured.view_all", "View all")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <FeaturedHostels />

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/hostels"
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600"
            >
              {setting("home.featured.view_all_mobile", "View all hostels")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ BROWSE BY CITY (Marquee) ══════════ */}
      <CityMarquee />

      {/* ══════════ NEARBY HOSTELS ══════════ */}
      <NearbyHostels />

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="relative overflow-hidden bg-white py-18 sm:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-b from-zinc-50/90 to-white" />
          <div className="absolute left-1/2 top-8 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-100/55 blur-[90px]" />
          <div className="absolute left-1/2 top-12 h-44 w-44 -translate-x-1/2 rounded-full border border-emerald-200/50" />
          <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-cyan-100/40 blur-3xl" />
          <div className="absolute top-0 right-0 h-60 w-60 rounded-full bg-teal-100/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <div className="mx-auto mb-5 h-px w-28 bg-linear-to-r from-transparent via-emerald-300 to-transparent" />
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {setting("home.how.badge", "Simple Process")}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
              {setting("home.how.title", "How It Works")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-zinc-600">
              {setting("home.how.subtitle", "Book your hostel in 3 simple steps")}
            </p>
            <div className="mx-auto mt-5 h-px w-20 bg-linear-to-r from-transparent via-zinc-300 to-transparent" />
          </div>

          <div className="relative mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-16 hidden h-px bg-linear-to-r from-transparent via-emerald-300/60 to-transparent sm:block" />

            {howSteps.map((item, idx) => (
              <div
                key={item.step}
                className="group relative h-full overflow-hidden rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-700/10"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-linear-to-br from-emerald-50 via-white to-cyan-50" />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm">
                      <item.icon className="h-6 w-6" />
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                        Step
                      </p>
                      <p className="-mt-1 text-3xl leading-none font-black text-zinc-800">
                        {item.step}
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-zinc-900">{item.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600">{item.desc}</p>

                  <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                      {idx === 2 ? "Ready to stay" : "Next step"}
                    </span>
                    <ArrowRight className="h-4 w-4 text-emerald-600 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
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
            {setting("home.cta.badge", "For Hostel Owners")}
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl tracking-tight">
            {setting("home.cta.title_line_1", "Own a Hostel?")} {" "}
            <span className="bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              {setting("home.cta.title_line_2", "List It for Free")}
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-400 leading-relaxed">
            {setting(
              "home.cta.description",
              "Reach thousands of students and travelers across Nepal. Manage bookings, track payments, and grow your business."
            )}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex h-13 items-center justify-center rounded-2xl bg-emerald-600 px-10 text-base font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]"
            >
              {setting("home.cta.primary_button", "Register as Host")}
            </Link>
            <Link
              href="/hostels"
              className="inline-flex h-13 items-center justify-center rounded-2xl border border-zinc-700 px-10 text-base font-semibold text-zinc-300 transition-all hover:border-zinc-500 hover:text-white hover:bg-white/5"
            >
              {setting("home.cta.secondary_button", "Browse Hostels")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
