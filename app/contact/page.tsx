"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  Building2,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { contactApi } from "@/lib/api/contact";
import { APP_NAME } from "@/lib/constants";
import type { ContactFormData, ContactSubject, ApiError } from "@/lib/types";

const SUBJECT_OPTIONS: { value: ContactSubject; label: string; icon: React.ReactNode }[] = [
  { value: "general", label: "General Inquiry", icon: <MessageSquare className="h-4 w-4" /> },
  { value: "booking", label: "Booking Issue", icon: <Clock className="h-4 w-4" /> },
  { value: "listing", label: "Listing / Host Support", icon: <Building2 className="h-4 w-4" /> },
  { value: "feedback", label: "Feedback", icon: <CheckCircle2 className="h-4 w-4" /> },
  { value: "partnership", label: "Partnership", icon: <Mail className="h-4 w-4" /> },
  { value: "other", label: "Other", icon: <MessageSquare className="h-4 w-4" /> },
];

const CONTACT_INFO = [
  {
    icon: <Mail className="h-5 w-5" />,
    title: "Email Us",
    value: "hello@hostelfinder.np",
    description: "We typically respond within 24 hours",
  },
  {
    icon: <Phone className="h-5 w-5" />,
    title: "Call Us",
    value: "+977-1-4XXXXXX",
    description: "Mon–Fri, 9:00 AM – 6:00 PM NPT",
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: "Visit Us",
    value: "Kathmandu, Nepal",
    description: "Thamel, Kathmandu 44600",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubjectSelect = (value: ContactSubject) => {
    setForm((prev) => ({ ...prev, subject: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await contactApi.submit(form);
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "general", message: "" });
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900">Message Sent!</h2>
          <p className="mt-3 text-zinc-500 leading-relaxed">
            Thank you for reaching out. Our team will review your enquiry and get back to you within 24 hours.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setSuccess(false)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:-translate-y-0.5"
            >
              Send Another Message
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50"
            >
              Back to Home
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-950 py-20 sm:py-28">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-600/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-600/5 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="transition-colors hover:text-emerald-400">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-zinc-400">Contact</span>
          </div>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 ring-1 ring-emerald-500/20 mb-6">
              <MessageSquare className="h-3.5 w-3.5" />
              Get in Touch
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              We&apos;d love to hear{" "}
              <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                from you
              </span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-400">
              Have a question, feedback, or need help with your booking? 
              Drop us a message and our team will get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CONTACT_INFO.map((info, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-200"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition-all group-hover:bg-emerald-600 group-hover:text-white group-hover:ring-emerald-600">
                {info.icon}
              </div>
              <h3 className="text-sm font-semibold text-zinc-900">{info.title}</h3>
              <p className="mt-1 text-base font-medium text-emerald-600">{info.value}</p>
              <p className="mt-1 text-xs text-zinc-400">{info.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Left column — context */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-zinc-900 sm:text-3xl">
              Send us a message
            </h2>
            <p className="mt-3 text-zinc-500 leading-relaxed">
              Fill out the form and our team will respond within 24 hours. 
              For urgent matters, feel free to call us directly.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">Fast Response</h4>
                  <p className="mt-1 text-sm text-zinc-500">
                    We aim to respond to all enquiries within 24 hours during business days.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">Helpful Support</h4>
                  <p className="mt-1 text-sm text-zinc-500">
                    Our dedicated team is here to help with bookings, listings, or any questions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">Satisfaction Guaranteed</h4>
                  <p className="mt-1 text-sm text-zinc-500">
                    We&apos;re committed to resolving your concerns and ensuring a great experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              {/* Subject selector */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  What can we help with?
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {SUBJECT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSubjectSelect(opt.value)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                        form.subject === opt.value
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                      }`}
                    >
                      <span className={form.subject === opt.value ? "text-emerald-600" : "text-zinc-400"}>
                        {opt.icon}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Email row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="mt-4">
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Phone Number <span className="text-zinc-400 text-xs">(optional)</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+977-XXXXXXXXXX"
                  className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Message */}
              <div className="mt-4">
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  required
                  className="block w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/30 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed sm:w-auto"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
