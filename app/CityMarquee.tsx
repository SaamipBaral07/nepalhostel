"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { hostelsApi } from "@/lib/api/hostels";
import type { City } from "@/lib/types";

const GRADIENTS = [
  "from-emerald-600 to-teal-700",
  "from-sky-600 to-blue-700",
  "from-violet-600 to-purple-700",
  "from-amber-600 to-orange-700",
  "from-green-600 to-emerald-700",
  "from-yellow-600 to-amber-700",
  "from-rose-600 to-pink-700",
  "from-cyan-600 to-teal-700",
  "from-indigo-600 to-violet-700",
  "from-teal-600 to-cyan-700",
  "from-orange-600 to-red-700",
];

function CityCard({ city, index }: { city: City; index: number }) {
  return (
    <Link
      href={`/hostels?city=${city.name}`}
      className="group relative shrink-0"
    >
      <div className="relative h-72 w-52 overflow-hidden rounded-2xl sm:h-80 sm:w-60">
        {city.imageUrl ? (
          <img
            src={city.imageUrl}
            alt={city.name}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            sizes="(max-width: 640px) 14rem, 15rem"
            className="transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div
            className={`h-full w-full bg-linear-to-br ${GRADIENTS[index % GRADIENTS.length]}`}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex items-center gap-1.5 text-white/60">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{city.tagline}</span>
          </div>

          <p className="mt-1 text-xl font-bold text-white tracking-tight">
            {city.name}
          </p>

          {/* Explore indicator */}
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
            Explore hostels &rarr;
          </div>
        </div>

        {/* Hover border */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/0 transition-all duration-300 group-hover:ring-white/25" />
      </div>
    </Link>
  );
}

export function CityMarquee() {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    hostelsApi
      .getCities()
      .then((res) => setCities(res.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (!isLoading && cities.length === 0) return null;

  const duplicatedCards = [...cities, ...cities];

  return (
    <section className="overflow-hidden bg-zinc-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
          <MapPin className="h-3.5 w-3.5" />
          Popular Destinations
        </span>
        <h2 className="mt-4 text-2xl font-extrabold text-zinc-900 sm:text-3xl lg:text-4xl">
          Browse by City
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-zinc-500">
          Find hostels in Nepal&apos;s most popular destinations
        </p>
      </div>

      <div className="relative mt-12 overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-zinc-50 to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-zinc-50 to-transparent sm:w-32" />

        <motion.div
          className="flex w-max gap-5 px-4"
          animate={{ x: ["0%", "-50%"] }}
          whileHover={{ animationPlayState: "paused" }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {duplicatedCards.map((city, index) => (
            <CityCard
              key={`${city.name}-${index}`}
              city={city}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}