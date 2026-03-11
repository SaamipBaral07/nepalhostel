import Link from "next/link";
import { Building2, MapPin, Mail } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const footerLinks = {
  platform: [
    { href: "/hostels", label: "Browse Hostels" },
    { href: "/hostels?city=Kathmandu", label: "Kathmandu" },
    { href: "/hostels?city=Pokhara", label: "Pokhara" },
    { href: "/hostels?city=Lalitpur", label: "Lalitpur" },
  ],
  categories: [
    { href: "/hostels?gender=boys", label: "Boys Hostels" },
    { href: "/hostels?gender=girls", label: "Girls Hostels" },
    { href: "/hostels?gender=unisex", label: "Unisex Hostels" },
    { href: "/hostels?gender=tourist", label: "Tourist Hostels" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-zinc-200/60 bg-zinc-950">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-lg font-bold text-white"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                <Building2 className="h-4.5 w-4.5 text-white" />
              </div>
              {APP_NAME}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-400">
              Find and book the best hostels across Nepal. For students,
              travelers, and everyone in between.
            </p>
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-zinc-500">
                <MapPin className="h-4 w-4 text-zinc-600" />
                Kathmandu, Nepal
              </div>
              <div className="flex items-center gap-2.5 text-sm text-zinc-500">
                <Mail className="h-4 w-4 text-zinc-600" />
                hello@hostelfinder.np
              </div>
            </div>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Top Cities
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-7 sm:flex-row">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="text-xs text-zinc-600 transition-colors hover:text-zinc-400">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-zinc-600 transition-colors hover:text-zinc-400">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
