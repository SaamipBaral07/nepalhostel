"use client";

import { useState, useEffect, type MouseEvent } from "react";
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

  const handleTeamCardMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    event.currentTarget.style.setProperty("--mx", `${x}px`);
    event.currentTarget.style.setProperty("--my", `${y}px`);
  };

  const handleTeamCardMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--mx", "50%");
    event.currentTarget.style.setProperty("--my", "50%");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-120 sm:h-135 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/kathmandu-valley.avif"
            alt="Boudhanath Stupa, Kathmandu"
            className="h-full w-full object-cover object-center"
          />
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-zinc-900/80 via-zinc-900/50 to-zinc-900/90" />
          <div className="absolute inset-0 bg-linear-to-r from-emerald-950/30 via-transparent to-cyan-950/20" />
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Hero Content */}
        <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          

          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
            <Building2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-semibold tracking-widest text-emerald-300 uppercase">
              About Us
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {page.title.includes(" ") ? (
              <>
                {page.title.split(" ").slice(0, Math.ceil(page.title.split(" ").length / 2)).join(" ")}
                <span className="block mt-1 bg-linear-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                  {page.title.split(" ").slice(Math.ceil(page.title.split(" ").length / 2)).join(" ")}
                </span>
              </>
            ) : (
              page.title
            )}
          </h1>

          {/* Subtitle */}
          {page.subtitle && (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              {page.subtitle}
            </p>
          )}
        </div>

        {/* Bottom fade into content */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white to-transparent" />
      </div>

      {/* Stats Bar */}
      {stats.length > 0 && (
        <section className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-11">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.id}
                className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 text-center shadow-md shadow-zinc-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-emerald-500 via-teal-400 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition-all group-hover:bg-emerald-600 group-hover:text-white group-hover:ring-emerald-600">
                  {getIconSm(stat.icon)}
                </div>
                <div className="text-xl font-extrabold text-zinc-900 sm:text-2xl">
                  {stat.title}
                </div>
                <div className="mt-1 text-[11px] font-medium text-zinc-500 uppercase tracking-wider sm:text-xs">
                  {stat.subtitle}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Story / Body */}
      {page.body && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <div className="sticky top-24 rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  Our Story
                </div>
                <h2 className="mt-4 text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl">
                  Building Better Stays Across Nepal
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  We help travelers discover verified, value-packed hostels with confidence.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="prose prose-zinc prose-lg max-w-none">
                  {page.body.split("\n\n").map((para, i) => (
                    <p key={i} className="text-zinc-600 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Core Values */}
      {values.length > 0 && (
        <section className="relative overflow-hidden bg-linear-to-b from-zinc-50 to-white py-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -left-16 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
            <div className="absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative mx-auto mb-10 max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200 mb-4">
                <Target className="h-3.5 w-3.5" />
                What We Stand For
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Our Core Values</h2>
              <p className="mt-3 text-zinc-500">
                The principles that drive everything we do.
              </p>
            </div>
            <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, i) => (
                <div
                  key={value.id}
                  className="card-enter group relative rounded-2xl border border-zinc-200/80 bg-white/95 p-5 shadow-sm backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-200"
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
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-200">
                <Users className="h-3.5 w-3.5" />
                The People Behind It
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Meet Our Team</h2>
              <p className="mt-3 text-zinc-500">
                Passionate individuals dedicated to making your hostel experience exceptional.
              </p>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member, i) => (
                <div
                  key={member.id}
                  className="card-enter group relative h-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 shadow-sm backdrop-blur-[2px] transition-all duration-500 hover:-translate-y-1.5 hover:border-emerald-200 hover:shadow-xl"
                  style={{ animationDelay: `${i * 100}ms` }}
                  onMouseMove={handleTeamCardMouseMove}
                  onMouseLeave={handleTeamCardMouseLeave}
                >
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500" />
                  <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-emerald-50/80 to-transparent" />
                  <div
                    className="pointer-events-none absolute inset-0 hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:block"
                    style={{
                      background:
                        "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), rgba(16, 185, 129, 0.16), transparent 68%)",
                    }}
                  />
                  <div
                    className={`pointer-events-none absolute inset-0 ${
                      i % 3 === 0
                        ? "bg-linear-to-br from-emerald-50/35 via-transparent to-transparent"
                        : i % 3 === 1
                          ? "bg-linear-to-br from-cyan-50/35 via-transparent to-transparent"
                          : "bg-linear-to-br from-teal-50/35 via-transparent to-transparent"
                    }`}
                  />

                  <div className="relative flex h-full flex-col p-5 pt-6 text-center">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.title}
                        className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-lg shadow-zinc-900/10 transition-all duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-emerald-100 to-teal-100 ring-4 ring-white shadow-lg shadow-zinc-900/10 transition-all duration-300 group-hover:scale-105">
                        <span className="text-2xl font-bold text-emerald-700">
                          {member.title
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                      </div>
                    )}

                    <h3 className="mt-4 text-base font-bold text-zinc-900">{member.title}</h3>
                    <div className="mx-auto mt-2 h-px w-10 bg-linear-to-r from-transparent via-zinc-300 to-transparent" />
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      {member.subtitle}
                    </p>

                    {member.body && (
                      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-600">
                        {member.body}
                      </p>
                    )}
                    {!member.body && <div className="mt-3 flex-1" />}

                    <div className="mt-4 flex items-center justify-center gap-2 border-t border-zinc-100 pt-3">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      <p className="text-xs font-medium text-zinc-500">Verified team member</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="relative overflow-hidden bg-linear-to-b from-zinc-50/90 to-white py-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-14 left-1/3 h-44 w-44 rounded-full bg-amber-200/30 blur-3xl" />
            <div className="absolute bottom-0 right-10 h-56 w-56 rounded-full bg-emerald-100/30 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200">
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

            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, i) => (
                <FAQItem key={faq.id} index={i + 1} question={faq.title} answer={faq.body} />
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-zinc-200/80 bg-white/80 p-4 text-center shadow-sm backdrop-blur-sm sm:p-5">
              <p className="text-sm text-zinc-600">
                Didn&apos;t find your answer?
                <Link href="/contact" className="ml-2 font-semibold text-emerald-700 hover:text-emerald-800">
                  Contact our support team
                </Link>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden bg-zinc-950 py-12 sm:py-16">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-96 rounded-full bg-emerald-600/20 blur-3xl" />
          <div className="absolute -bottom-14 left-10 h-44 w-44 rounded-full bg-cyan-500/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/3 p-6 backdrop-blur-sm sm:p-8">
            <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
              <div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Ready to find your perfect hostel?
                </h2>
                <p className="mt-3 max-w-xl text-zinc-400">
                  Browse verified stays, compare amenities, and book with confidence.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-stretch">
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
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({
  index,
  question,
  answer,
}: {
  index: number;
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`group rounded-2xl border bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-300 ${
        open
          ? "border-emerald-200 shadow-lg shadow-emerald-900/5"
          : "border-zinc-200/80 hover:border-zinc-300 hover:shadow-md"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left sm:px-6"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-[11px] font-bold text-zinc-600 ring-1 ring-zinc-200 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:ring-emerald-200">
            {String(index).padStart(2, "0")}
          </span>
          <span className="pt-0.5 text-sm font-semibold leading-relaxed text-zinc-900 sm:text-base">
            {question}
          </span>
        </div>
        <ChevronDown
          className={`mt-0.5 h-8 w-8 shrink-0 rounded-full border p-1.5 transition-all duration-200 ${
            open
              ? "rotate-180 border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-zinc-200 text-zinc-400 group-hover:border-zinc-300"
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-4 mb-4 rounded-xl border border-emerald-100 bg-linear-to-br from-emerald-50/60 to-white px-4 py-4 sm:mx-6 sm:px-5">
          <p className="text-sm leading-relaxed text-zinc-600 sm:text-[15px]">{answer}</p>
        </div>
      </div>
    </div>
  );
}
