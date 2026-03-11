"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  MapPin,
  Star,
  ShieldCheck,
  BadgeCheck,
  Headphones,
  Heart,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Loader2,
  User,
  Sparkles,
  Target,
  Globe,
} from "lucide-react";
import { pagesApi } from "@/lib/api/pages";
import { APP_NAME } from "@/lib/constants";
import type { SitePage, SitePageSection } from "@/lib/types";

// Map icon names from backend to Lucide components
const ICON_MAP: Record<string, React.ReactNode> = {
  Building2: <Building2 className="h-6 w-6" />,
  Users: <Users className="h-6 w-6" />,
  MapPin: <MapPin className="h-6 w-6" />,
  Star: <Star className="h-6 w-6" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6" />,
  BadgeCheck: <BadgeCheck className="h-6 w-6" />,
  Headphones: <Headphones className="h-6 w-6" />,
  Heart: <Heart className="h-6 w-6" />,
  User: <User className="h-6 w-6" />,
  Sparkles: <Sparkles className="h-6 w-6" />,
  Target: <Target className="h-6 w-6" />,
  Globe: <Globe className="h-6 w-6" />,
};

function getIcon(iconName: string) {
  return ICON_MAP[iconName] || <Sparkles className="h-6 w-6" />;
}

// Small icon version for stats
const ICON_MAP_SM: Record<string, React.ReactNode> = {
  Building2: <Building2 className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  MapPin: <MapPin className="h-5 w-5" />,
  Star: <Star className="h-5 w-5" />,
};

function getIconSm(iconName: string) {
  return ICON_MAP_SM[iconName] || <Sparkles className="h-5 w-5" />;
}

export default function AboutPage() {
  const [page, setPage] = useState<SitePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    pagesApi
      .getBySlug("about")
      .then((res) => setPage(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Building2 className="h-12 w-12 text-zinc-200" />
        <h2 className="mt-4 text-xl font-bold text-zinc-900">Page Not Found</h2>
        <p className="mt-2 text-zinc-500">The about page content hasn&apos;t been set up yet.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700"
        >
          Go Home
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const stats = page.sections.filter((s) => s.sectionType === "stat");
  const values = page.sections.filter((s) => s.sectionType === "value");
  const team = page.sections.filter((s) => s.sectionType === "team");
  const faqs = page.sections.filter((s) => s.sectionType === "faq");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-zinc-950 py-20 sm:py-28">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-teal-600/8 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-600/5 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="transition-colors hover:text-emerald-400">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-zinc-400">About</span>
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-500/20 mb-6">
              <Building2 className="h-3.5 w-3.5" />
              About Us
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {page.title}
            </h1>
            {page.subtitle && (
              <p className="mt-6 text-lg leading-relaxed text-zinc-400 sm:text-xl">
                {page.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      {stats.length > 0 && (
        <section className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.id}
                className="group rounded-2xl border border-zinc-200 bg-white p-5 text-center shadow-lg shadow-zinc-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-200"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition-all group-hover:bg-emerald-600 group-hover:text-white group-hover:ring-emerald-600">
                  {getIconSm(stat.icon)}
                </div>
                <div className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">
                  {stat.title}
                </div>
                <div className="mt-1 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  {stat.subtitle}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Story / Body */}
      {page.body && (
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-1 rounded-full bg-emerald-600" />
            <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Our Story</h2>
          </div>
          <div className="prose prose-zinc prose-lg max-w-none">
            {page.body.split("\n\n").map((para, i) => (
              <p key={i} className="text-zinc-600 leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Core Values */}
      {values.length > 0 && (
        <section className="bg-zinc-50/70 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200 mb-4">
                <Target className="h-3.5 w-3.5" />
                What We Stand For
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Our Core Values</h2>
              <p className="mt-3 text-zinc-500">
                The principles that drive everything we do.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, i) => (
                <div
                  key={value.id}
                  className="card-enter group relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-emerald-200"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Accent line */}
                  <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-linear-to-r from-emerald-500 to-teal-500 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:ring-emerald-600 group-hover:shadow-lg group-hover:shadow-emerald-600/25">
                    {getIcon(value.icon)}
                  </div>
                  <h3 className="text-base font-bold text-zinc-900">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {value.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {team.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-700 ring-1 ring-violet-200 mb-4">
                <Users className="h-3.5 w-3.5" />
                The People Behind It
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Meet Our Team</h2>
              <p className="mt-3 text-zinc-500">
                Passionate individuals dedicated to making your hostel experience exceptional.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member, i) => (
                <div
                  key={member.id}
                  className="card-enter group text-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:border-violet-200"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.title}
                      className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-zinc-100 transition-all group-hover:ring-violet-100"
                    />
                  ) : (
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-violet-100 to-purple-100 ring-4 ring-zinc-100 transition-all group-hover:ring-violet-100">
                      <span className="text-2xl font-bold text-violet-600">
                        {member.title
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <h3 className="mt-4 text-base font-bold text-zinc-900">{member.title}</h3>
                  <p className="mt-1 text-sm font-medium text-emerald-600">{member.subtitle}</p>
                  {member.body && (
                    <p className="mt-3 text-sm text-zinc-500 leading-relaxed">{member.body}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="bg-zinc-50/70 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200 mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Got Questions?
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-zinc-500">
                Everything you need to know about {APP_NAME}.
              </p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <FAQItem key={faq.id} question={faq.title} answer={faq.body} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden bg-zinc-950 py-16 sm:py-24">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-96 rounded-full bg-emerald-600/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-4xl">
            Ready to find your perfect hostel?
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Browse hundreds of verified hostels across Nepal and book your stay today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/hostels"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:-translate-y-0.5"
            >
              Browse Hostels
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-medium text-white/80 transition-all hover:bg-white/5 hover:text-white"
            >
              Contact Us
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white transition-all hover:border-zinc-300">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-sm font-semibold text-zinc-900">{question}</span>
        <ChevronDown
          className={`mt-0.5 h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-zinc-100 px-6 py-4">
          <p className="text-sm leading-relaxed text-zinc-600">{answer}</p>
        </div>
      </div>
    </div>
  );
}
