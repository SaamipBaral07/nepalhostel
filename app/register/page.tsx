"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2, Eye, EyeOff, Backpack, Home,
  Upload, X, ArrowRight, Shield, User, Mail, Phone, Lock, CheckCircle2,
  MapPin, Star, TrendingUp, Users, BadgeCheck, Wallet,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api/auth";
import { APP_NAME } from "@/lib/constants";
import type { UserRole } from "@/lib/types";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user" as UserRole,
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "email") {
      const normalized = value.trim().toLowerCase();
      if (normalized !== verifiedEmail) {
        setIsEmailVerified(false);
      }
      setOtpMessage("");
    }
  };

  const isHost = form.role === "host";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setError("Image size should be less than 5MB"); return; }
      if (!file.type.startsWith("image/")) { setError("Please upload an image file"); return; }
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview("");
  };

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = setTimeout(() => setOtpCooldown((v) => v - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpCooldown]);

  const normalizedEmail = form.email.trim().toLowerCase();

  const handleRequestOtp = async () => {
    setError("");
    setOtpMessage("");

    if (!normalizedEmail) {
      setError("Please enter your email address first.");
      return;
    }

    setIsSendingOtp(true);
    try {
      const response = await authApi.requestEmailVerification({
        email: normalizedEmail,
      });
      setOtpRequested(true);
      setIsEmailVerified(false);
      setVerifiedEmail("");
      setOtp("");
      setOtpCooldown(90);
      setOtpMessage(response.message || "OTP sent to your email.");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setOtpMessage("");

    if (!otpRequested) {
      setError("Request OTP first.");
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter a valid 6-digit OTP.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await authApi.confirmEmailVerification({
        email: normalizedEmail,
        otp,
      });
      setIsEmailVerified(true);
      setVerifiedEmail(normalizedEmail);
      setOtpMessage(response.message || "Email verified successfully.");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setIsEmailVerified(false);
      setError(apiErr.message || "OTP verification failed.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isEmailVerified || verifiedEmail !== normalizedEmail) {
      setError("Please verify your email with OTP before creating account.");
      return;
    }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setIsLoading(true);
    try {
      await register({ ...form, avatar });
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const pwStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const pwLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];
  const pwColor = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"][pwStrength];

  // Content that switches based on role
  const travelerPerks = [
    { icon: MapPin, title: "500+ Verified Hostels", sub: "Across Nepal's top destinations", color: "#10b981" },
    { icon: BadgeCheck, title: "Trusted Reviews", sub: "Real ratings from real travelers", color: "#3b82f6" },
    { icon: Star, title: "Instant Booking", sub: "Confirmed in seconds, no fees", color: "#f59e0b" },
    { icon: Users, title: "Community", sub: "Connect with fellow explorers", color: "#8b5cf6" },
  ];

  const hostPerks = [
    { icon: TrendingUp, title: "Grow Your Bookings", sub: "Reach thousands of travelers daily", color: "#10b981" },
    { icon: Wallet, title: "Earn More", sub: "Keep 95% of every booking", color: "#f59e0b" },
    { icon: BadgeCheck, title: "Verified Badge", sub: "Build trust with a certified listing", color: "#3b82f6" },
    { icon: Users, title: "Dashboard & Analytics", sub: "Manage guests & track revenue", color: "#8b5cf6" },
  ];

  const perks = isHost ? hostPerks : travelerPerks;

  const stats = isHost
    ? [
        { value: "2,400+", label: "Active hosts" },
        { value: "NPR 0", label: "Listing fee" },
        { value: "95%", label: "Payout rate" },
      ]
    : [
        { value: "500+", label: "Hostels listed" },
        { value: "18+", label: "Cities covered" },
        { value: "12k+", label: "Happy travelers" },
      ];

  return (
    <>
      <style>{`
        .reg-page {
          min-height: 100vh;
          background-color: #f8fafc;
          display: flex;
          flex-direction: column;
        }

        .reg-bg {
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.4;
          pointer-events: none; z-index: 0;
        }

        .reg-wash-tl {
          position: fixed; top: -160px; left: -160px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }
        .reg-wash-br {
          position: fixed; bottom: -120px; right: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }

        .reg-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%; max-width: 1000px;
          margin: 0 auto;
          background: #fff;
          border-radius: 24px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06), 0 20px 48px rgba(0,0,0,0.07);
          overflow: hidden;
          animation: rise 0.5s cubic-bezier(0.16,1,0.3,1) both;
          position: relative; z-index: 1;
        }

        @keyframes rise {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 760px) {
          .reg-layout { grid-template-columns: 1fr; max-width: 520px; }
          .reg-panel-left { display: none; }
        }

        /* ── Left panel ── */
        .reg-panel-left {
          background: linear-gradient(160deg, #064e3b 0%, #065f46 45%, #047857 100%);
          padding: 44px 36px;
          display: flex; flex-direction: column;
          position: relative; overflow: hidden;
          transition: all 0.4s ease;
        }

        .reg-panel-left::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .reg-panel-left::after {
          content: '';
          position: absolute;
          width: 380px; height: 380px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
          top: -80px; right: -80px; pointer-events: none;
        }

        .left-logo {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px; padding: 8px 14px 8px 10px;
          position: relative; z-index: 1; width: fit-content;
        }

        .left-logo-icon {
          width: 30px; height: 30px;
          background: rgba(255,255,255,0.18);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── Role toggle label ── */
        .role-label-strip {
          position: relative; z-index: 1;
          margin-top: 32px;
        }

        .role-eyebrow {
          font-size: 10.5px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 8px;
        }

        /* ── Perk cards ── */
        .perk-list {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; gap: 10px;
          margin-top: 8px;
        }

        .perk-card {
          display: flex; align-items: center; gap: 13px;
          padding: 13px 14px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 13px;
          transition: background 0.2s, transform 0.2s;
          animation: perk-in 0.35s ease both;
        }

        .perk-card:hover {
          background: rgba(255,255,255,0.1);
          transform: translateX(3px);
        }

        @keyframes perk-in {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .perk-icon-wrap {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* ── Stats row ── */
        .stats-row {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          overflow: hidden;
          margin-top: auto;
          padding-top: 28px;
        }

        /* just the inner cells */
        .stats-row > div {
          background: rgba(255,255,255,0.04);
          padding: 14px 10px;
          text-align: center;
        }

        /* ── Right panel ── */
        .reg-panel-right {
          display: flex; flex-direction: column;
        }

        .reg-form-header {
          padding: 32px 40px 20px;
          border-bottom: 1px solid #f3f4f6;
        }

        .reg-form-body {
          padding: 24px 40px 28px;
          flex: 1;
        }

        /* ── Role cards ── */
        .role-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin-bottom: 22px;
        }

        .role-card {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px;
          border-radius: 12px; border: 1.5px solid #e5e7eb;
          background: #fff; cursor: pointer;
          transition: all 0.18s ease; text-align: left;
        }

        .role-card:hover { border-color: #d1d5db; background: #f9fafb; }

        .role-card.active {
          border-color: #10b981;
          background: #f0fdf4;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
        }

        .role-icon-wrap {
          width: 36px; height: 36px; border-radius: 10px;
          background: #f3f4f6;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.18s; flex-shrink: 0;
        }

        .role-card.active .role-icon-wrap { background: #d1fae5; }
        .role-card.active .role-icon-wrap svg { color: #059669; }

        /* ── Avatar ── */
        .avatar-section {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px;
          background: #f9fafb;
          border: 1.5px dashed #e5e7eb;
          border-radius: 13px; margin-bottom: 18px;
          transition: border-color 0.18s;
        }

        .avatar-section:hover { border-color: #d1d5db; }

        .avatar-circle {
          width: 60px; height: 60px; border-radius: 50%;
          border: 2px solid #e5e7eb; background: #fff;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; flex-shrink: 0; position: relative;
        }

        .avatar-remove {
          position: absolute; top: -3px; right: -3px;
          width: 18px; height: 18px;
          background: #ef4444; border-radius: 50%;
          border: 2px solid #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 2;
        }

        /* ── Fields ── */
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field-wrap { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
        .field-wrap:last-child { margin-bottom: 0; }

        .field-label {
          font-size: 12px; font-weight: 600; color: #374151;
          display: flex; align-items: center; gap: 5px;
        }
        .field-label svg { color: #9ca3af; }

        .field-input {
          width: 100%; height: 44px; padding: 0 14px;
          border-radius: 11px; border: 1.5px solid #e5e7eb;
          background: #f9fafb; font-size: 13.5px; color: #111827;
          outline: none; transition: all 0.18s;
          box-sizing: border-box; font-family: inherit;
        }
        .field-input::placeholder { color: #9ca3af; }
        .field-input:hover { border-color: #d1d5db; background: #fff; }
        .field-input:focus {
          border-color: #10b981; background: #fff;
          box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
        }
        .field-input.pr { padding-right: 42px; }

        .otp-row {
          display: flex;
          gap: 8px;
          margin-top: 10px;
          align-items: center;
        }

        @media (max-width: 640px) {
          .otp-row {
            flex-direction: column;
            align-items: stretch;
          }
        }

        .otp-btn {
          height: 40px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          background: #ffffff;
          color: #0f172a;
          font-size: 12px;
          font-weight: 600;
          padding: 0 12px;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }

        .otp-btn:hover { background: #f8fafc; border-color: #9ca3af; }
        .otp-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .otp-status {
          margin-top: 8px;
          font-size: 12px;
          color: #047857;
          font-weight: 600;
        }

        .field-input-wrap { position: relative; }

        .eye-btn {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          color: #9ca3af; background: none; border: none;
          cursor: pointer; padding: 2px;
          display: flex; align-items: center; transition: color 0.15s;
        }
        .eye-btn:hover { color: #4b5563; }

        /* pw bars */
        .pw-bars { display: flex; gap: 4px; margin-top: 6px; }
        .pw-bar { flex: 1; height: 3px; border-radius: 10px; background: #e5e7eb; transition: background 0.3s; }

        /* ── Submit ── */
        .reg-submit {
          width: 100%; height: 48px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #fff; border: none; border-radius: 12px;
          font-size: 14px; font-weight: 600; font-family: inherit;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 8px; transition: all 0.18s;
          box-shadow: 0 2px 8px rgba(16,185,129,0.25), 0 1px 2px rgba(0,0,0,0.06);
          position: relative; overflow: hidden; margin-top: 22px;
        }
        .reg-submit::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }
        .reg-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(16,185,129,0.35); }
        .reg-submit:active { transform: translateY(0); }
        .reg-submit:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .reg-submit .arrow { transition: transform 0.18s; }
        .reg-submit:hover .arrow { transform: translateX(3px); }

        .btn-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.35); border-top-color: #fff;
          border-radius: 50%; animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* error */
        .error-alert {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 11px 14px; background: #fff5f5;
          border: 1px solid #fed7d7; border-radius: 11px;
          margin-bottom: 16px; animation: shake 0.3s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        .error-icon {
          width: 16px; height: 16px; background: #fc8181; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; color: #fff; flex-shrink: 0; margin-top: 1px;
        }

        /* footer */
        .reg-footer {
          border-top: 1px solid #f3f4f6; background: #fafafa;
          padding: 14px 40px;
          display: flex; align-items: center; justify-content: space-between;
        }
      `}</style>

      <div className="reg-page">
        <div className="reg-bg" />
        <div className="reg-wash-tl" />
        <div className="reg-wash-br" />

        <div className="h-14 shrink-0" />

        <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
          <div className="reg-layout">

            {/* ══ LEFT PANEL ══ */}
            <div className="reg-panel-left">

              {/* Logo */}
              <Link href="/" className="left-logo">
                <div className="left-logo-icon">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-semibold text-sm">{APP_NAME}</span>
              </Link>

              {/* Dynamic headline */}
              <div className="role-label-strip">
                <p className="role-eyebrow">
                  {isHost ? "For hostel owners" : "For travelers"}
                </p>
                <h2 className="text-white text-[26px] font-bold leading-tight tracking-tight">
                  {isHost ? (
                    <>List your hostel,<br /><span className="text-emerald-300">grow your revenue.</span></>
                  ) : (
                    <>Find your perfect<br /><span className="text-emerald-300">stay in Nepal.</span></>
                  )}
                </h2>
                <p className="text-emerald-100/45 text-[13px] mt-2.5 leading-relaxed">
                  {isHost
                    ? "Join Nepal's fastest-growing hostel platform and connect with thousands of travelers every day."
                    : "Discover verified hostels across Nepal's most beautiful cities, mountains, and jungles."}
                </p>
              </div>

              {/* Perk cards — dynamic */}
              <div className="perk-list mt-6">
                {perks.map((p, i) => (
                  <div key={p.title} className="perk-card" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="perk-icon-wrap" style={{ background: `${p.color}1a` }}>
                      <p.icon className="w-4 h-4" style={{ color: p.color }} />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{p.title}</p>
                      <p className="text-white/45 text-xs mt-0.5">{p.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats — dynamic */}
              <div className="stats-row">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-white text-lg font-bold">{s.value}</p>
                    <p className="text-white/40 text-[11px] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

            </div>

            {/* ══ RIGHT PANEL ══ */}
            <div className="reg-panel-right">

              <div className="reg-form-header">
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Create your account</h1>
                <p className="text-zinc-500 text-sm mt-1">
                  {isHost ? "Start listing your hostel in minutes" : "Join as a traveler or list your hostel"}
                </p>
              </div>

              <div className="reg-form-body">

                {/* Role selector */}
                <div className="role-grid">
                  {[
                    { value: "user", label: "I'm a Traveler", sub: "Find & book hostels", icon: Backpack },
                    { value: "host", label: "I'm a Host", sub: "List my hostel", icon: Home },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => update("role", opt.value)}
                      className={`role-card ${form.role === opt.value ? "active" : ""}`}
                    >
                      <div className="role-icon-wrap">
                        <opt.icon className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-zinc-800 text-sm font-semibold">{opt.label}</p>
                        <p className="text-zinc-400 text-xs">{opt.sub}</p>
                      </div>
                      {form.role === opt.value && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Avatar */}
                <div className="avatar-section">
                  <div className="avatar-circle">
                    {avatarPreview ? (
                      <>
                        <Image src={avatarPreview} alt="Preview" width={60} height={60} className="w-full h-full object-cover" />
                        <button type="button" className="avatar-remove" onClick={removeAvatar}>
                          <X className="w-2.5 h-2.5 text-white" />
                        </button>
                      </>
                    ) : (
                      <User className="w-5 h-5 text-zinc-300" />
                    )}
                  </div>
                  <div>
                    <p className="text-zinc-700 text-sm font-semibold mb-0.5">Profile Photo <span className="text-zinc-400 font-normal">(optional)</span></p>
                    <p className="text-zinc-400 text-xs mb-2">JPG, PNG or GIF · max 5MB</p>
                    <input type="file" id="avatar" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    <label
                      htmlFor="avatar"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-600 cursor-pointer hover:bg-zinc-50 hover:border-zinc-300 transition-all"
                    >
                      <Upload className="w-3 h-3" />
                      {avatarPreview ? "Change photo" : "Upload photo"}
                    </label>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="error-alert">
                    <div className="error-icon">!</div>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="field-row">
                    <div className="field-wrap">
                      <label htmlFor="fullName" className="field-label">
                        <User className="w-3 h-3" /> Full Name
                      </label>
                      <input
                        id="fullName" className="field-input" placeholder="Ram Sharma"
                        value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required
                      />
                    </div>
                    <div className="field-wrap">
                      <label htmlFor="phone" className="field-label">
                        <Phone className="w-3 h-3" /> Phone
                      </label>
                      <input
                        id="phone" type="tel" className="field-input" placeholder="98XXXXXXXX"
                        value={form.phone} onChange={(e) => update("phone", e.target.value)} required
                      />
                    </div>
                  </div>

                  <div className="field-wrap">
                    <label htmlFor="email" className="field-label">
                      <Mail className="w-3 h-3" /> Email Address
                    </label>
                    <input
                      id="email" type="email" className="field-input" placeholder="you@example.com"
                      value={form.email} onChange={(e) => update("email", e.target.value)} required autoComplete="email"
                    />
                    {normalizedEmail && (
                      <div style={{
                        padding: "10px 12px",
                        background: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        borderRadius: "10px",
                        marginTop: "8px",
                        marginBottom: "8px",
                        fontSize: "11px",
                        color: "#166534",
                        lineHeight: "1.4",
                      }}>
                        <p>📧 We'll send a 6-digit OTP to verify this email. Verification is required to create account.</p>
                      </div>
                    )}
                    <div className="otp-row">
                      <button
                        type="button"
                        className="otp-btn"
                        onClick={handleRequestOtp}
                        disabled={isSendingOtp || otpCooldown > 0 || !normalizedEmail}
                      >
                        {isSendingOtp
                          ? "Sending..."
                          : otpCooldown > 0
                          ? `Resend in ${otpCooldown}s`
                          : otpRequested
                          ? "Resend OTP"
                          : "Send OTP"}
                      </button>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="6-digit OTP from email"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        disabled={!otpRequested || isEmailVerified}
                      />
                      <button
                        type="button"
                        className="otp-btn"
                        onClick={handleVerifyOtp}
                        disabled={!otpRequested || isVerifyingOtp || isEmailVerified || otp.length !== 6}
                      >
                        {isVerifyingOtp ? "Verifying..." : isEmailVerified ? "✓ Verified" : "Verify"}
                      </button>
                    </div>
                    <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "6px", lineHeight: "1.4" }}>
                      Check spam folder if OTP doesn't arrive. Wait 90s to resend.
                    </p>
                    {otpMessage && <p className="otp-status">{otpMessage}</p>}
                  </div>

                  <div className="field-row">
                    <div className="field-wrap">
                      <label htmlFor="password" className="field-label">
                        <Lock className="w-3 h-3" /> Password
                      </label>
                      <div className="field-input-wrap">
                        <input
                          id="password" type={showPassword ? "text" : "password"}
                          className="field-input pr" placeholder="••••••••"
                          value={form.password} onChange={(e) => update("password", e.target.value)}
                          required autoComplete="new-password"
                        />
                        <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {form.password && (
                        <>
                          <div className="pw-bars">
                            {[1,2,3,4].map(i => (
                              <div key={i} className="pw-bar" style={{ background: i <= pwStrength ? pwColor : "#e5e7eb" }} />
                            ))}
                          </div>
                          <p className="text-[11px] mt-0.5 font-medium" style={{ color: pwColor }}>{pwLabel}</p>
                        </>
                      )}
                    </div>

                    <div className="field-wrap">
                      <label htmlFor="confirmPassword" className="field-label">
                        <Lock className="w-3 h-3" /> Confirm Password
                      </label>
                      <div className="field-input-wrap">
                        <input
                          id="confirmPassword" type="password"
                          className="field-input pr"
                          style={form.confirmPassword
                            ? form.confirmPassword === form.password
                              ? { borderColor: "#10b981" }
                              : { borderColor: "#ef4444" }
                            : {}}
                          placeholder="••••••••"
                          value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)}
                          required autoComplete="new-password"
                        />
                        {form.confirmPassword && (
                          <div className="eye-btn" style={{ pointerEvents: "none" }}>
                            {form.confirmPassword === form.password
                              ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              : <X className="w-3.5 h-3.5 text-red-400" />}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="reg-submit" disabled={isLoading || !isEmailVerified}>
                    {isLoading ? (
                      <><div className="btn-spinner" /> Creating your account…</>
                    ) : (
                      <>{isHost ? "Create Host Account" : "Create Account"} <ArrowRight className="w-4 h-4 arrow" /></>
                    )}
                  </button>
                </form>
              </div>

              <div className="reg-footer">
                <p className="text-sm text-zinc-500">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                    Sign in →
                  </Link>
                </p>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Shield className="w-3 h-3" />
                  SSL secured
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}