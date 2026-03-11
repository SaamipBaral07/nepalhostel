"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2, Lock, Eye, EyeOff, ArrowRight, ArrowLeft,
  CheckCircle2, AlertTriangle,
} from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { APP_NAME } from "@/lib/constants";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") || "";
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const invalidLink = !uid || !token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword(uid, token, password);
      setSuccess(true);
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || "Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  // Strength indicator
  const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "#ef4444", "#f59e0b", "#10b981", "#059669"];

  return (
    <>
      <style>{`
        .rp-page {
          min-height: 100vh;
          background-color: #f8fafc;
          display: flex;
          flex-direction: column;
        }

        .rp-bg {
          position: fixed; inset: 0;
          background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.4;
          pointer-events: none; z-index: 0;
        }

        .rp-wash-tl {
          position: fixed; top: -160px; left: -160px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }

        .rp-wash-br {
          position: fixed; bottom: -120px; right: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }

        .rp-card {
          width: 100%; max-width: 460px;
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

        .rp-header {
          padding: 36px 40px 24px;
          border-bottom: 1px solid #f3f4f6;
        }

        .rp-body {
          padding: 28px 40px 32px;
        }

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

        .btn-spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

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

        .rp-footer {
          border-top: 1px solid #f3f4f6; background: #fafafa;
          padding: 14px 40px;
        }
      `}</style>

      <div className="rp-page">
        <div className="rp-bg" />
        <div className="rp-wash-tl" />
        <div className="rp-wash-br" />

        {/* Navbar spacer */}
        <div className="h-14 shrink-0" />

        <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
          <div className="rp-card">

            {/* Header */}
            <div className="rp-header">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 w-fit mb-5"
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">{APP_NAME}</span>
              </Link>

              {success ? (
                <>
                  <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Password reset!</h1>
                  <p className="text-zinc-500 text-sm mt-1">
                    Your password has been changed successfully.
                  </p>
                </>
              ) : invalidLink ? (
                <>
                  <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Invalid link</h1>
                  <p className="text-zinc-500 text-sm mt-1">
                    This password reset link is invalid or has expired.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Set new password</h1>
                  <p className="text-zinc-500 text-sm mt-1">
                    Choose a strong password for your account.
                  </p>
                </>
              )}
            </div>

            <div className="rp-body">
              {success ? (
                /* Success state */
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <p className="text-sm text-zinc-600 mb-6">
                    You can now sign in with your new password.
                  </p>
                  <Link href="/login" className="submit-btn inline-flex no-underline">
                    Go to sign in <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : invalidLink ? (
                /* Invalid link state */
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                  </div>
                  <p className="text-sm text-zinc-600 mb-6">
                    Please request a new password reset link.
                  </p>
                  <Link href="/forgot-password" className="submit-btn inline-flex no-underline">
                    Request new link <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                /* Form state */
                <>
                  {error && (
                    <div className="error-alert">
                      <div className="error-icon">!</div>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* New Password */}
                    <div className="field-wrap">
                      <label htmlFor="password" className="field-label">
                        <Lock className="w-3 h-3" /> New password
                      </label>
                      <div className="field-input-wrap">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className="field-input pr"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={8}
                          autoComplete="new-password"
                          autoFocus
                        />
                        <button
                          type="button"
                          className="eye-btn"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Strength meter */}
                      {password && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex gap-1 flex-1">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className="h-1 flex-1 rounded-full transition-colors"
                                style={{
                                  backgroundColor: i <= strength ? strengthColors[strength] : "#e5e7eb",
                                }}
                              />
                            ))}
                          </div>
                          <span
                            className="text-[11px] font-medium"
                            style={{ color: strengthColors[strength] }}
                          >
                            {strengthLabels[strength]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="field-wrap">
                      <label htmlFor="confirmPassword" className="field-label">
                        <Lock className="w-3 h-3" /> Confirm new password
                      </label>
                      <div className="field-input-wrap">
                        <input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          className="field-input pr"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                          autoComplete="new-password"
                        />
                      </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={isLoading}>
                      {isLoading ? (
                        <><div className="btn-spinner" /> Resetting password…</>
                      ) : (
                        <>Reset password <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="rp-footer">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-emerald-600 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
