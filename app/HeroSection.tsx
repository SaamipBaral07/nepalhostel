"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, ChevronRight } from "lucide-react";
import { GENDER_CATEGORIES } from "@/lib/constants";
import { hostelsApi } from "@/lib/api/hostels";
import type { City } from "@/lib/types";

interface HeroSectionProps {
  badgeText?: string;
  titleLine1?: string;
  titleHighlight?: string;
  description?: string;
  cityPlaceholder?: string;
  searchButtonText?: string;
  quickLabel?: string;
  quickLabels?: Partial<Record<"boys" | "girls" | "unisex" | "tourist", string>>;
}

export function HeroSection({
  badgeText = "Nepal's #1 Hostel Platform",
  titleLine1 = "Find Your Perfect",
  titleHighlight = "Hostel in Nepal",
  description = "Whether you're a student looking for affordable accommodation or a traveler exploring the Himalayas — we've got you covered.",
  cityPlaceholder = "All Cities",
  searchButtonText = "Search Hostels",
  quickLabel = "Quick:",
  quickLabels,
}: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    hostelsApi
      .getCities()
      .then((res) => setCities(res.data))
      .catch(() => {});
  }, []);

  // Safe video playback — prevents AbortError
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const safePlay = () => {
      playPromiseRef.current = video.play();
      playPromiseRef.current?.catch(() => {
        // Autoplay blocked or interrupted — ignore silently
      });
    };

    // Slightly slower playback makes the loop feel longer and calmer.
    const handleLoadedMetadata = () => {
      video.playbackRate = 0.85;
    };

    const handleCanPlay = () => safePlay();

    video.addEventListener("loadedmetadata", handleLoadedMetadata, {
      once: true,
    });
    video.addEventListener("canplay", handleCanPlay, { once: true });
    // Attempt initial play
    safePlay();

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  return (
    <section className="relative min-h-145 sm:min-h-160 overflow-hidden bg-zinc-950">
      {/* ── Layer 1: Background video ── */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        className="hero-video absolute inset-0 z-0 h-full w-full object-cover scale-105"
      >
        <source src="/hero-hostel3.mp4" type="video/mp4" />
      </video>

      {/* ── Layer 2: Premium overlays ── */}
      <div className="absolute inset-0 z-1 bg-black/50" />
      <div className="absolute inset-0 z-1 bg-linear-to-r from-zinc-950/70 via-zinc-950/30 to-transparent" />
      <div className="absolute inset-0 z-1 bg-linear-to-t from-zinc-950/80 via-transparent to-zinc-950/40" />
      {/* Emerald accent glow */}
      <div className="absolute inset-0 z-1 bg-linear-to-br from-emerald-900/20 via-transparent to-cyan-900/10" />

      {/* ── Layer 3: Main content ── */}
      <div className="relative z-2 mx-auto flex h-full min-h-145 sm:min-h-160 max-w-7xl items-end px-4 sm:px-6 lg:items-center lg:px-8">
        {/* Left column: Character image (desktop only) */}
        <div className="hidden lg:flex lg:w-85 xl:w-100 shrink-0 self-end items-end">
          <div className="relative">
            <Image
              src="/hero-heroine.png"
              alt="Traveler pointing towards hostel listings"
              width={400}
              height={533}
              priority
              className="h-auto w-full max-w-100 drop-shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>

        {/* Right column: Content */}
        <div className="flex-1 pb-14 pt-24 sm:pb-20 sm:pt-28 lg:pb-0 lg:pl-12 lg:pt-0">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            {/* Badge */}
            <div
              className={`hero-stagger mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-5 py-2 backdrop-blur-md ${
                isLoaded ? "hero-stagger-visible" : ""
              }`}
              style={{ transitionDelay: "0ms" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-sm font-semibold text-emerald-300 tracking-wide">
                {badgeText}
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`hero-stagger text-[2.5rem] leading-[1.1] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4rem] ${
                isLoaded ? "hero-stagger-visible" : ""
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              {titleLine1}
              <br />
              <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                {titleHighlight}
              </span>
            </h1>

            {/* Description */}
            <p
              className={`hero-stagger mt-5 max-w-lg text-base leading-7 text-white/75 sm:text-lg sm:leading-8 [text-shadow:0_2px_12px_rgba(0,0,0,0.6)] ${
                isLoaded ? "hero-stagger-visible" : ""
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              {description}
            </p>

            {/* Search Bar */}
            <div
              className={`hero-stagger mt-8 ${
                isLoaded ? "hero-stagger-visible" : ""
              }`}
              style={{ transitionDelay: "320ms" }}
            >
              <form
                action="/hostels"
                className="flex flex-col gap-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                  <select
                    name="city"
                    className="h-14 w-full rounded-2xl border-0 bg-white/95 pl-12 pr-4 text-base text-zinc-900 shadow-2xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none cursor-pointer"
                    defaultValue=""
                  >
                    <option value="">{cityPlaceholder}</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-zinc-400 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="hero-cta-glow flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 px-8 text-base font-semibold text-white transition-all duration-300 hover:bg-emerald-500 active:scale-[0.98]"
                >
                  <Search className="h-5 w-5" />
                  {searchButtonText}
                </button>
              </form>
            </div>

            {/* Quick category links */}
            <div
              className={`hero-stagger mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start ${
                isLoaded ? "hero-stagger-visible" : ""
              }`}
              style={{ transitionDelay: "440ms" }}
            >
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider mr-1">
                {quickLabel}
              </span>
              {GENDER_CATEGORIES.map((cat) => (
                <Link
                  key={cat.value}
                  href={`/hostels?gender=${cat.value}`}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:border-emerald-400/40 hover:bg-emerald-500/15 hover:text-white"
                >
                  {quickLabels?.[cat.value as "boys" | "girls" | "unisex" | "tourist"] || cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Ultra soft bottom fade ── */}
      <div className="absolute inset-x-0 bottom-0 z-3 h-8 bg-linear-to-t from-white/60 to-transparent pointer-events-none" />
    </section>
  );
}
