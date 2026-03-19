"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Building2, Eye, EyeOff, ArrowRight, Shield,
  BadgeCheck, Lock, Mail,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { APP_NAME } from "@/lib/constants";

const GoogleLoginButton = dynamic(
  () => import("@/components/auth/GoogleLoginButton").then((m) => m.GoogleLoginButton),
  { ssr: false, loading: () => <button type="button" className="google-btn" disabled>Continue with Google</button> }
);

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    setError("");
    setIsGoogleLoading(true);
    try {
      await googleLogin(credential);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Google login failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const stats = [
    { value: "500+",  label: "Hostels"  },
    { value: "18+",   label: "Cities"   },
    { value: "12k+",  label: "Members"  },
  ];

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          background-color: #f8fafc;
          display: flex;
          flex-direction: column;
        }

        .login-bg {
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.4;
          pointer-events: none; z-index: 0;
        }

        .login-wash-tl {
          position: fixed; top: -160px; left: -160px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }

        .login-wash-br {
          position: fixed; bottom: -120px; right: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }

        /* ── Split layout ── */
        .login-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%; max-width: 960px;
          margin: 0 auto;
          background: #fff;
          border-radius: 24px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow:
            0 1px 2px rgba(0,0,0,0.04),
            0 4px 12px rgba(0,0,0,0.06),
            0 20px 48px rgba(0,0,0,0.07);
          overflow: hidden;
          animation: rise 0.5s cubic-bezier(0.16,1,0.3,1) both;
          position: relative; z-index: 1;
        }

        @keyframes rise {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 720px) {
          .login-layout { grid-template-columns: 1fr; max-width: 480px; }
          .login-panel-left { display: none; }
        }

        /* ── Left panel ── */
        .login-panel-left {
          background: linear-gradient(160deg, #064e3b 0%, #065f46 45%, #047857 100%);
          padding: 48px 40px;
          display: flex; flex-direction: column;
          position: relative; overflow: hidden;
        }

        .login-panel-left::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .login-panel-left::after {
          content: '';
          position: absolute;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
          top: -80px; right: -80px;
          pointer-events: none;
        }

        /* ── Left logo ── */
        .left-logo {
          display: inline-flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 8px 14px 8px 10px;
          position: relative; z-index: 1; width: fit-content;
          text-decoration: none;
        }

        .left-logo-icon {
          width: 30px; height: 30px;
          background: rgba(255,255,255,0.18);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── Right panel ── */
        .login-panel-right {
          display: flex; flex-direction: column;
        }

        .login-form-header {
          padding: 36px 44px 24px;
          border-bottom: 1px solid #f3f4f6;
        }

        .login-form-body {
          padding: 28px 44px 28px;
          flex: 1;
        }

        /* ── Fields ── */
        .field-wrap { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
        .field-wrap:last-of-type { margin-bottom: 0; }

        .field-label {
          font-size: 12.5px; font-weight: 600; color: #374151;
          display: flex; align-items: center; gap: 5px;
        }
        .field-label svg { color: #9ca3af; }

        .field-input-wrap { position: relative; }

        .field-input {
          width: 100%; height: 46px; padding: 0 14px;
          border-radius: 12px; border: 1.5px solid #e5e7eb;
          background: #f9fafb; font-size: 14px; color: #111827;
          outline: none; transition: all 0.18s;
          box-sizing: border-box; font-family: inherit;
        }
        .field-input::placeholder { color: #9ca3af; }
        .field-input:hover { border-color: #d1d5db; background: #fff; }
        .field-input:focus {
          border-color: #10b981; background: #fff;
          box-shadow: 0 0 0 3.5px rgba(16,185,129,0.1);
        }
        .field-input.pr { padding-right: 44px; }

        .eye-btn {
          position: absolute; right: 13px; top: 50%;
          transform: translateY(-50%);
          color: #9ca3af; background: none; border: none;
          cursor: pointer; padding: 2px;
          display: flex; align-items: center; transition: color 0.15s;
        }
        .eye-btn:hover { color: #4b5563; }

        /* ── Submit ── */
        .submit-btn {
          width: 100%; height: 48px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #fff; border: none; border-radius: 12px;
          font-size: 14px; font-weight: 600; font-family: inherit;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 8px; letter-spacing: 0.01em;
          transition: all 0.18s ease;
          box-shadow: 0 2px 8px rgba(16,185,129,0.25), 0 1px 2px rgba(0,0,0,0.06);
          position: relative; overflow: hidden;
          margin-top: 22px;
        }
        .submit-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }
        .submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(16,185,129,0.35), 0 2px 4px rgba(0,0,0,0.08);
        }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .submit-btn .arrow { transition: transform 0.18s; }
        .submit-btn:hover .arrow { transform: translateX(3px); }

        /* ── Spinner ── */
        .btn-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Divider ── */
        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 22px 0;
        }
        .divider-line { flex: 1; height: 1px; background: #f3f4f6; }
        .divider-text { font-size: 12px; color: #9ca3af; font-weight: 500; }

        /* ── Google btn ── */
        .google-btn {
          width: 100%; height: 46px;
          background: #fff; border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          font-size: 13.5px; font-weight: 500; color: #374151;
          cursor: pointer; transition: all 0.18s; font-family: inherit;
        }
        .google-btn:hover {
          background: #f9fafb; border-color: #d1d5db;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        /* ── Error ── */
        .error-alert {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 11px 14px; background: #fff5f5;
          border: 1px solid #fed7d7; border-radius: 11px;
          margin-bottom: 18px;
          animation: shake 0.3s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        .error-icon {
          width: 17px; height: 17px; background: #fc8181;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; color: #fff; flex-shrink: 0; margin-top: 1px;
        }

        /* ── Footer ── */
        .login-footer {
          border-top: 1px solid #f3f4f6; background: #fafafa;
          padding: 14px 44px;
          display: flex; align-items: center; justify-content: space-between;
        }
      `}</style>

      <div className="login-page">
        <div className="login-bg" />
        <div className="login-wash-tl" />
        <div className="login-wash-br" />

        {/* Navbar spacer */}
        <div className="h-14 shrink-0" />

        <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
          <div className="login-layout">

            {/* ══ LEFT PANEL ══ */}
            <div className="login-panel-left">

              {/* Logo */}
              <Link href="/" className="left-logo">
                <div className="left-logo-icon">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-semibold text-sm">{APP_NAME}</span>
              </Link>

              {/* Centered hero text */}
              <div className="relative z-10 flex flex-col flex-1 justify-center">
                <p className="text-emerald-300/60 text-[10.5px] font-bold tracking-widest uppercase mb-4">
                  Nepal's Hostel Platform
                </p>
                <h2 className="text-white text-[32px] font-bold leading-tight tracking-tight">
                  Your next<br />adventure<br />
                  <span className="text-emerald-300">starts here.</span>
                </h2>

                {/* Divider */}
                <div className="w-10 h-0.5 bg-emerald-400/40 rounded-full mt-6 mb-6" />

                {/* Stats — just 3 numbers, no card container */}
                <div className="flex items-center gap-8">
                  {stats.map((s, i) => (
                    <div key={s.label}>
                      <p className="text-white text-xl font-bold">{s.value}</p>
                      <p className="text-white/40 text-[11px] mt-0.5 uppercase tracking-wide">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom tagline */}
              <p className="relative z-10 text-white/25 text-[11px]">
                For travelers &amp; hostel owners across Nepal
              </p>
            </div>

            {/* ══ RIGHT PANEL ══ */}
            <div className="login-panel-right">

              {/* Header */}
              <div className="login-form-header">
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Welcome back</h1>
                <p className="text-zinc-500 text-sm mt-1">Sign in to your account to continue</p>
              </div>

              <div className="login-form-body">

                {/* Error */}
                {error && (
                  <div className="error-alert">
                    <div className="error-icon">!</div>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* Email */}
                  <div className="field-wrap">
                    <label htmlFor="email" className="field-label">
                      <Mail className="w-3 h-3" /> Email address
                    </label>
                    <div className="field-input-wrap">
                      <input
                        id="email" type="email" className="field-input"
                        placeholder="you@example.com"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        required autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="field-wrap">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="field-label">
                        <Lock className="w-3 h-3" /> Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="field-input-wrap">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="field-input pr"
                        placeholder="••••••••"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        required autoComplete="current-password"
                      />
                      <button
                        type="button" className="eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? (
                      <><div className="btn-spinner" /> Signing in…</>
                    ) : (
                      <>Sign in to your account <ArrowRight className="w-4 h-4 arrow" /></>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="divider">
                  <div className="divider-line" />
                  <span className="divider-text">or continue with</span>
                  <div className="divider-line" />
                </div>

                {/* Google */}
                <GoogleLoginButton
                  onSuccess={handleGoogleLogin}
                  onError={(message) => setError(message)}
                  isLoading={isGoogleLoading}
                />

                {/* Trust signals */}
                <div className="flex items-center justify-center gap-4 mt-6 pt-5 border-t border-zinc-100">
                  {[
                    { icon: Shield, label: "SSL Secured" },
                    { icon: BadgeCheck, label: "SOC 2 Compliant" },
                    { icon: Lock, label: "GDPR Ready" },
                  ].map((t) => (
                    <div key={t.label} className="flex items-center gap-1.5 text-zinc-400">
                      <t.icon className="w-3 h-3 text-emerald-500" />
                      <span className="text-[11px] font-medium">{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="login-footer">
                <p className="text-sm text-zinc-500">
                  No account yet?{" "}
                  <Link href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                    Create one free →
                  </Link>
                </p>
                <p className="text-xs text-zinc-400">
                  For travelers &amp; hosts
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}