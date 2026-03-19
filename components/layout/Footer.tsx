"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { siteSettingsApi } from "@/lib/api/siteSettings";
import { widgetsApi } from "@/lib/api/widgets";
import type { SiteSettingsMap, SocialLink, SocialPlatform } from "@/lib/types";

type FooterLink = {
  href: string;
  label: string;
};

const SOCIAL_ICONS: Record<SocialPlatform, React.ReactNode> = {
  facebook: <Facebook className="h-4 w-4" />,
  instagram: <Instagram className="h-4 w-4" />,
  twitter: <Globe className="h-4 w-4" />,
  youtube: <Youtube className="h-4 w-4" />,
  tiktok: <Globe className="h-4 w-4" />,
  linkedin: <Linkedin className="h-4 w-4" />,
  whatsapp: <Phone className="h-4 w-4" />,
  viber: <Phone className="h-4 w-4" />,
  other: <Globe className="h-4 w-4" />,
};

const FALLBACK_LINKS = {
  platform: [
    { href: "/hostels", label: "Browse Hostels" },
    { href: "/hostels?city=Kathmandu", label: "Hostels in Kathmandu" },
    { href: "/hostels?city=Pokhara", label: "Hostels in Pokhara" },
    { href: "/hostels?city=Lalitpur", label: "Hostels in Lalitpur" },
  ] satisfies FooterLink[],
  categories: [
    { href: "/hostels?gender=boys", label: "Boys Hostels" },
    { href: "/hostels?gender=girls", label: "Girls Hostels" },
    { href: "/hostels?gender=unisex", label: "Unisex Hostels" },
    { href: "/hostels?gender=tourist", label: "Tourist Hostels" },
  ] satisfies FooterLink[],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/register", label: "List Your Hostel" },
    { href: "/hostels", label: "Explore Hostels" },
  ] satisfies FooterLink[],
};

export function Footer() {
  const [settings, setSettings] = useState<SiteSettingsMap>({});
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    siteSettingsApi
      .list()
      .then((res) => setSettings(res.data))
      .catch(() => {});

    widgetsApi
      .getSocialLinks()
      .then((res) => setSocialLinks(res.data))
      .catch(() => {});
  }, []);

  const setting = (key: string, fallback: string) => {
    const value = settings[key];
    return value && value.trim() ? value : fallback;
  };

  const resolveLinks = (prefix: string, fallbackLinks: FooterLink[]) => {
    const links = Array.from({ length: 6 }, (_, i) => {
      const idx = i + 1;
      const href = settings[`${prefix}.${idx}.url`]?.trim();
      const label = settings[`${prefix}.${idx}.label`]?.trim();
      if (!href || !label) return null;
      return { href, label };
    }).filter((item): item is FooterLink => Boolean(item));

    return links.length > 0 ? links : fallbackLinks;
  };

  const links = useMemo(
    () => ({
      platform: resolveLinks("footer.links.platform", FALLBACK_LINKS.platform),
      categories: resolveLinks("footer.links.categories", FALLBACK_LINKS.categories),
      company: resolveLinks("footer.links.company", FALLBACK_LINKS.company),
    }),
    [settings]
  );

  const renderHref = (href: string, label: string, className: string) => {
    const isExternal = /^https?:\/\//i.test(href);
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {label}
        </a>
      );
    }
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  };

  return (
    <footer className="relative overflow-hidden border-t border-zinc-200/60 bg-zinc-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-b from-emerald-600/6 via-transparent to-transparent" />
        <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
      </div>

      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-3xl border border-white/10 bg-white/4 p-5 backdrop-blur-sm sm:p-6">
          <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                {setting("footer.top.badge", "For Guests & Hostel Owners")}
              </p>
              <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                {setting("footer.top.title", "Need help finding the right stay?")}
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
                {setting(
                  "footer.top.subtitle",
                  "Explore verified hostels, compare amenities, and book confidently in minutes."
                )}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href={setting("footer.top.primary.url", "/hostels")}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-500"
              >
                {setting("footer.top.primary.label", "Browse Hostels")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={setting("footer.top.secondary.url", "/contact")}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-zinc-300 transition-all hover:bg-white/5 hover:text-white"
              >
                {setting("footer.top.secondary.label", "Contact Support")}
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-bold text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-600/25">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              {setting("footer.brand.name", APP_NAME)}
            </Link>

            <p className="mt-4 max-w-md text-sm leading-7 text-zinc-400">
              {setting(
                "footer.brand.description",
                "Find and book trusted hostels across Nepal for students, professionals, and travelers."
              )}
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                <MapPin className="h-4 w-4 text-emerald-400" />
                {setting("footer.contact.address", "Kathmandu, Nepal")}
              </div>
              <a
                href={`mailto:${setting("footer.contact.email", "hello@hostelfinder.np")}`}
                className="flex items-center gap-2.5 text-sm text-zinc-400 transition-colors hover:text-emerald-300"
              >
                <Mail className="h-4 w-4 text-emerald-400" />
                {setting("footer.contact.email", "hello@hostelfinder.np")}
              </a>
              <a
                href={`tel:${setting("footer.contact.phone", "+977-9800000000").replace(/\s+/g, "")}`}
                className="flex items-center gap-2.5 text-sm text-zinc-400 transition-colors hover:text-emerald-300"
              >
                <Phone className="h-4 w-4 text-emerald-400" />
                {setting("footer.contact.phone", "+977-9800000000")}
              </a>
            </div>

            {socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label || social.platform}
                    title={social.label || social.platform}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/5 text-zinc-300 transition-all hover:border-emerald-300/50 hover:bg-emerald-500/15 hover:text-emerald-300"
                  >
                    {SOCIAL_ICONS[social.platform] ?? SOCIAL_ICONS.other}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  {setting("footer.links.platform.heading", "Top Cities")}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {links.platform.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      {renderHref(
                        link.href,
                        link.label,
                        "text-sm text-zinc-400 transition-colors hover:text-emerald-300"
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  {setting("footer.links.categories.heading", "Categories")}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {links.categories.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      {renderHref(
                        link.href,
                        link.label,
                        "text-sm text-zinc-400 transition-colors hover:text-emerald-300"
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  {setting("footer.links.company.heading", "Company")}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {links.company.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      {renderHref(
                        link.href,
                        link.label,
                        "text-sm text-zinc-400 transition-colors hover:text-emerald-300"
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row">
          <p className="text-xs text-zinc-500">
            {setting(
              "footer.bottom.copyright",
              `© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.`
            ).replace("{year}", String(new Date().getFullYear()))}
          </p>
          <div className="flex items-center gap-5">
            {renderHref(
              setting("footer.bottom.link1.url", "/about"),
              setting("footer.bottom.link1.label", "About"),
              "text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            )}
            {renderHref(
              setting("footer.bottom.link2.url", "/contact"),
              setting("footer.bottom.link2.label", "Contact"),
              "text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            )}
            {renderHref(
              setting("footer.bottom.link3.url", "/hostels"),
              setting("footer.bottom.link3.label", "Hostels"),
              "text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
