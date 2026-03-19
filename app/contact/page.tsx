"use client";

import { useEffect, useState } from "react";
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
import { siteSettingsApi } from "@/lib/api/siteSettings";
import { APP_NAME } from "@/lib/constants";
import type { ContactFormData, ContactSubject, ApiError, SiteSettingsMap } from "@/lib/types";

const SUBJECT_OPTIONS: { value: ContactSubject; label: string; icon: React.ReactNode }[] = [
  { value: "general", label: "General Inquiry", icon: <MessageSquare className="h-4 w-4" /> },
  { value: "booking", label: "Booking Issue", icon: <Clock className="h-4 w-4" /> },
  { value: "listing", label: "Listing / Host Support", icon: <Building2 className="h-4 w-4" /> },
  { value: "feedback", label: "Feedback", icon: <CheckCircle2 className="h-4 w-4" /> },
  { value: "partnership", label: "Partnership", icon: <Mail className="h-4 w-4" /> },
  { value: "other", label: "Other", icon: <MessageSquare className="h-4 w-4" /> },
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
  const [settings, setSettings] = useState<SiteSettingsMap>({});

  const setting = (key: string, fallback: string) => {
    const value = settings[key];
    return value && value.trim() ? value : fallback;
  };

  const officeMapTitle = setting("contact.map.title", "Office Location");
  const officeMapCity = setting("contact.map.city", "Pokhara, Nepal");
  const officeMapDescription = setting(
    "contact.map.description",
    "Visit our support office in Pokhara."
  );
  const officeMapOpenUrl = setting(
    "contact.map.open_url",
    "https://maps.google.com/?q=Proforma%20Digital%20Solution%20Pvt.Ltd%20Pokhara"
  );
  const officeMapEmbedUrl = setting(
    "contact.map.embed_url",
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d280.49342038941364!2d83.9762193839299!3d28.20398683978662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399595a1ddb082e5%3A0xacfac249f506ab8b!2sProforma%20Digital%20Solution%20Pvt.Ltd!5e1!3m2!1sen!2snp!4v1773905545015!5m2!1sen!2snp"
  );

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: setting("contact.info.email.title", "Email Us"),
      value: setting("contact.info.email.value", "hello@hostelfinder.np"),
      description: setting("contact.info.email.description", "We typically respond within 24 hours"),
      href: `mailto:${setting("contact.info.email.value", "hello@hostelfinder.np")}`,
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: setting("contact.info.phone.title", "Call Us"),
      value: setting("contact.info.phone.value", "+977-1-4XXXXXX"),
      description: setting("contact.info.phone.description", "Mon-Fri, 9:00 AM - 6:00 PM NPT"),
      href: `tel:${setting("contact.info.phone.value", "+977-1-4XXXXXX").replace(/\s+/g, "")}`,
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: setting("contact.info.address.title", "Visit Us"),
      value: setting("contact.info.address.value", "Kathmandu, Nepal"),
      description: setting("contact.info.address.description", "Thamel, Kathmandu 44600"),
      href: officeMapOpenUrl,
    },
  ];

  useEffect(() => {
    siteSettingsApi
      .list()
      .then((res) => setSettings(res.data))
      .catch(() => {});
  }, []);

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
            {setting(
              "contact.success.description",
              "Thank you for reaching out. Our team will review your enquiry and get back to you within 24 hours."
            )}
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
      {/* Hero Banner */}
      <div className="relative h-120 sm:h-135 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/hero-2.jpg"
            alt="Kathmandu Valley, Nepal"
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
          
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
            <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-semibold tracking-widest text-emerald-300 uppercase">
              {setting("contact.hero.badge", "Get in Touch")}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {setting("contact.hero.title_line_1", "We'd Love to Hear")}
            <span className="block mt-1 bg-linear-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
              {setting("contact.hero.title_line_2", "From You")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            {setting(
              "contact.hero.subtitle",
              "Have a question, feedback, or need help with your booking? Drop us a message and our team will get back to you."
            )}
          </p>
        </div>

        {/* Bottom fade into content */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white to-transparent" />
      </div>

      {/* Contact Info Cards */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {contactInfo.map((info, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-200"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition-all group-hover:bg-emerald-600 group-hover:text-white group-hover:ring-emerald-600">
                {info.icon}
              </div>
              <h3 className="text-sm font-semibold text-zinc-900">{info.title}</h3>
              <a
                href={info.href}
                target={info.href.startsWith("http") ? "_blank" : undefined}
                rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="mt-1 inline-flex text-base font-medium text-emerald-600 transition-colors hover:text-emerald-700 hover:underline"
              >
                {info.value}
              </a>
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
              {setting("contact.form.title", "Send us a message")}
            </h2>
            <p className="mt-3 text-zinc-500 leading-relaxed">
              {setting(
                "contact.form.subtitle",
                "Fill out the form and our team will respond within 24 hours. For urgent matters, feel free to call us directly."
              )}
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900">Fast Response</h4>
                  <p className="mt-1 text-sm text-zinc-500">
                    {setting(
                      "contact.support.fast_response",
                      "We aim to respond to all enquiries within 24 hours during business days."
                    )}
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
                    {setting(
                      "contact.support.helpful_support",
                      "Our dedicated team is here to help with bookings, listings, or any questions."
                    )}
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
                    {setting(
                      "contact.support.satisfaction",
                      "We're committed to resolving your concerns and ensuring a great experience."
                    )}
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

      {/* --- OFFICE LOCATION SECTION --- */}
      <section className="relative py-20 sm:py-28 bg-linear-to-b from-white via-emerald-50/30 to-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-emerald-100/20 blur-3xl" />
          <div className="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-cyan-100/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12 text-center sm:mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-4 py-2 backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-semibold tracking-widest text-emerald-700 uppercase">Our Office</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Visit Us in Person
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-600 max-w-2xl mx-auto">
              Stop by our office in {officeMapCity} to discuss your hostel needs, get personalized recommendations, or simply say hello to our team.
            </p>
          </div>

          {/* Map Container */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-zinc-50 to-zinc-100 shadow-lg shadow-emerald-500/10 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/15">
                
                {/* Blur overlay on load */}
                <div className="absolute inset-0 bg-linear-to-b from-white/40 to-transparent z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-500" />

                {/* Map Iframe */}
                <div className="relative h-[350px] w-full sm:h-[450px] overflow-hidden">
                  <iframe
                    title="Office location"
                    src={officeMapEmbedUrl}
                    className="absolute inset-0 h-full w-full transition-all duration-700 group-hover:scale-105"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Map Footer Info */}
                <div className="border-t border-zinc-200/60 bg-white px-6 py-4 sm:px-8 sm:py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Location</p>
                        <p className="text-sm font-medium text-zinc-900">{officeMapCity}</p>
                      </div>
                    </div>
                    <a
                      href={officeMapOpenUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-700 transition-all hover:bg-emerald-100 hover:text-emerald-800"
                    >
                      <span>Get Directions</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Cards Column */}
            <div className="space-y-5">
              {/* Main Info Card */}
              <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-md shadow-emerald-500/5 transition-all hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-200/60">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-emerald-100 to-emerald-50 text-emerald-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-1">Office Details</h3>
                <p className="text-lg font-bold text-zinc-900 mb-2">{officeMapCity}</p>
                <p className="text-sm leading-relaxed text-zinc-600">
                  {officeMapDescription}
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-3">
                {/* Phone Card */}
                <a
                  href={`tel:${setting("contact.info.phone.value", "+977-1-4XXXXXX").replace(/\s+/g, "")}`}
                  className="group/card flex items-start gap-3 rounded-xl border border-zinc-200/60 bg-white p-4 transition-all hover:border-emerald-200/80 hover:bg-emerald-50/50 hover:shadow-md hover:shadow-emerald-500/5"
                >
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover/card:scale-110 transition-transform">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Call</p>
                    <p className="text-sm font-medium text-zinc-900">
                      {setting("contact.info.phone.value", "+977-1-4XXXXXX")}
                    </p>
                  </div>
                </a>

                {/* Email Card */}
                <a
                  href={`mailto:${setting("contact.info.email.value", "hello@hostelfinder.np")}`}
                  className="group/card flex items-start gap-3 rounded-xl border border-zinc-200/60 bg-white p-4 transition-all hover:border-emerald-200/80 hover:bg-emerald-50/50 hover:shadow-md hover:shadow-emerald-500/5"
                >
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 group-hover/card:scale-110 transition-transform">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Email</p>
                    <p className="text-sm font-medium text-zinc-900 truncate">
                      {setting("contact.info.email.value", "hello@hostelfinder.np")}
                    </p>
                  </div>
                </a>

                {/* Hours Card */}
                <div className="rounded-xl border border-zinc-200/60 bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Hours</p>
                      <p className="text-sm font-medium text-zinc-900">
                        {setting("contact.info.phone.description", "Mon-Fri, 9:00 AM - 6:00 PM NPT")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href={officeMapOpenUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all hover:shadow-xl hover:shadow-emerald-600/40 hover:from-emerald-700 hover:to-teal-700 active:scale-95"
              >
                <MapPin className="h-4 w-4" />
                Plan Your Visit
                <ChevronRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}