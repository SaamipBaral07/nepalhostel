"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, User, LogOut, PlusCircle, Building2, ChevronDown, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isTop, setIsTop] = useState(true);
  const pathname = usePathname();
  const { isAuthenticated, user, isHost, logout } = useAuth();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        setIsTop(currentY < 20);
        if (currentY < 80) {
          setVisible(true);
        } else if (currentY > lastScrollY.current + 5) {
          setVisible(false);
          setMobileOpen(false);
        } else if (currentY < lastScrollY.current - 5) {
          setVisible(true);
        }
        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

const isHome = pathname === "/" || pathname === "/hostels";

  return (
    <>
      <style>{`
        /* ── Active nav link underline ── */
        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 50%;
          transform: translateX(-50%);
          width: 18px; height: 2px;
          background: #10b981;
          border-radius: 10px;
        }

        /* ── User menu pill ── */
        .user-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 10px 5px 5px;
          border-radius: 100px;
          border: 1.5px solid #f3f4f6;
          background: #fff;
          transition: all 0.18s ease;
          cursor: pointer;
          text-decoration: none;
        }

        .user-pill:hover {
          border-color: #e5e7eb;
          background: #f9fafb;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        .user-avatar-ring {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff;
          flex-shrink: 0; overflow: hidden;
        }

        /* ── White nav refinements ── */
        .white-nav {
          border-bottom: 1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          box-shadow: 0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04);
        }

        /* ── Sign up button ── */
        .signup-btn {
          display: inline-flex; align-items: center;
          padding: 7px 16px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #fff;
          border-radius: 10px;
          font-size: 13px; font-weight: 600;
          border: none; cursor: pointer;
          transition: all 0.18s ease;
          text-decoration: none;
          box-shadow: 0 1px 3px rgba(16,185,129,0.25), 0 1px 2px rgba(0,0,0,0.05);
          position: relative; overflow: hidden;
        }

        .signup-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .signup-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16,185,129,0.3), 0 1px 3px rgba(0,0,0,0.08);
        }

        .signup-btn:active { transform: translateY(0); }

        /* ── Login btn ── */
        .login-btn {
          display: inline-flex; align-items: center;
          padding: 7px 14px;
          color: #374151;
          border-radius: 10px;
          font-size: 13px; font-weight: 500;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          cursor: pointer; transition: all 0.18s ease;
          text-decoration: none;
        }

        .login-btn:hover {
          border-color: #d1d5db;
          background: #f9fafb;
          color: #111827;
        }

        /* ── Logout btn ── */
        .logout-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #9ca3af;
          background: none; border: none; cursor: pointer;
          transition: all 0.18s;
        }
        .logout-btn:hover {
          color: #ef4444;
          background: #fff1f2;
        }

        /* ── Add hostel btn ── */
        .add-hostel-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 12px;
          border-radius: 9px;
          font-size: 13px; font-weight: 500;
          color: #059669;
          background: #f0fdf4;
          border: 1px solid #d1fae5;
          text-decoration: none;
          transition: all 0.18s;
        }
        .add-hostel-btn:hover {
          background: #dcfce7;
          border-color: #a7f3d0;
          color: #047857;
        }

        /* ── Mobile drawer ── */
        .mobile-drawer {
          margin-top: 6px;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(16px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);
          overflow: hidden;
          animation: drawer-in 0.2s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes drawer-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .mobile-drawer.dark-drawer {
          border-color: rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.65);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }

        .mobile-nav-link {
          display: flex; align-items: center;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13.5px; font-weight: 500;
          color: #374151;
          text-decoration: none;
          transition: all 0.15s;
          position: relative;
        }

        .mobile-nav-link:hover { background: #f9fafb; color: #111827; }
        .mobile-nav-link.active { color: #059669; background: #f0fdf4; }

        .mobile-nav-link.dark { color: rgba(255,255,255,0.75); }
        .mobile-nav-link.dark:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .mobile-nav-link.dark.active { color: #34d399; background: rgba(255,255,255,0.08); }

        /* ── Divider ── */
        .nav-divider {
          height: 1px; background: #f3f4f6; margin: 6px 0;
        }
        .nav-divider.dark { background: rgba(255,255,255,0.08); }
      `}</style>

      <header
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-300",
          visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
          isTop && isHome ? "top-4 mx-auto max-w-5xl px-4" : "top-0"
        )}
      >
        <nav
          className={cn(
            "mx-auto flex h-14 items-center justify-between transition-all duration-300",
            isTop && isHome
              ? "max-w-5xl rounded-full border border-white/15 bg-black/30 px-6 shadow-2xl backdrop-blur-xl"
              : "white-nav max-w-full px-4 sm:px-6 lg:px-10"
          )}
        >
          {/* ── Logo ── */}
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 font-bold transition-colors shrink-0",
              isTop && isHome ? "text-white" : "text-zinc-900"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
              isTop && isHome
                ? "bg-emerald-500/20"
                : "bg-emerald-600"
            )}>
              <Building2 className={cn(
                "h-4 w-4",
                isTop && isHome ? "text-emerald-300" : "text-white"
              )} />
            </div>
            <span className={cn(
              "hidden sm:inline text-[15px] tracking-tight",
              isTop && isHome ? "font-semibold" : "font-bold"
            )}>
              {APP_NAME}
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden items-center gap-0.5 md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all",
                    isTop && isHome
                      ? active
                        ? "text-emerald-400"
                        : "text-white/75 hover:text-white hover:bg-white/8"
                      : active
                        ? "text-emerald-700 bg-emerald-50 nav-link-active"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {isHost && (
              !isTop || !isHome ? (
                <Link href="/account/hostels/new" className="add-hostel-btn ml-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Hostel
                </Link>
              ) : (
                <Link
                  href="/account/hostels/new"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-lg text-white/75 hover:text-white hover:bg-white/8 transition-all"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Hostel
                </Link>
              )
            )}
          </div>

          {/* ── Desktop auth ── */}
          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/wishlist"
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                    isTop && isHome
                      ? "text-white/60 hover:text-rose-400 hover:bg-white/10"
                      : "text-zinc-400 hover:text-rose-500 hover:bg-rose-50"
                  )}
                  title="Wishlist"
                >
                  <Heart className="h-4 w-4" />
                </Link>
                <Link href="/account" className="user-pill"
                  style={isTop && isHome ? {
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "white"
                  } : {}}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName}
                      className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="user-avatar-ring">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className={cn(
                    "text-[13px] font-medium max-w-[100px] truncate",
                    isTop && isHome ? "text-white/90" : "text-zinc-700"
                  )}>
                    {user.fullName.split(" ")[0]}
                  </span>
                  <ChevronDown className={cn(
                    "w-3 h-3 shrink-0",
                    isTop && isHome ? "text-white/50" : "text-zinc-400"
                  )} />
                </Link>

                <button onClick={logout} className="logout-btn" title="Logout"
                  style={isTop && isHome ? { color: "rgba(255,255,255,0.5)" } : {}}>
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={cn(
                    isTop && isHome
                      ? "px-3.5 py-1.5 text-[13px] font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-all"
                      : "login-btn"
                  )}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    isTop && isHome
                      ? "px-4 py-1.5 text-[13px] font-semibold bg-emerald-500 hover:bg-emerald-400 text-white rounded-full transition-all shadow-lg shadow-emerald-500/20"
                      : "signup-btn"
                  )}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile menu button ── */}
          <button
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-xl md:hidden transition-all",
              isTop && isHome
                ? "text-white hover:bg-white/10"
                : "text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen
              ? <X className="h-4.5 w-4.5" />
              : <Menu className="h-4.5 w-4.5" />}
          </button>
        </nav>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div className={cn(
            "mobile-drawer md:hidden mx-1",
            isTop && isHome ? "dark-drawer" : ""
          )}>
            <div className="p-3 space-y-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "mobile-nav-link",
                    isTop && isHome ? "dark" : "",
                    pathname === link.href ? "active" : ""
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {isHost && (
                <Link
                  href="/account/hostels/new"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "mobile-nav-link",
                    isTop && isHome ? "dark" : ""
                  )}
                >
                  <PlusCircle className="h-4 w-4 mr-2 text-emerald-500" />
                  Add Hostel
                </Link>
              )}

              <div className={cn("nav-divider", isTop && isHome ? "dark" : "")} />

              {isAuthenticated && user ? (
                <>
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className={cn("mobile-nav-link", isTop && isHome ? "dark" : "")}
                  >
                    <Heart className="h-4 w-4 mr-2 text-rose-500" />
                    Wishlist
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className={cn("mobile-nav-link", isTop && isHome ? "dark" : "")}
                  >
                    <div className="user-avatar-ring mr-2.5 w-6 h-6 text-[10px]">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    {user.fullName}
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); logout(); }}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium transition-all",
                      "text-red-500 hover:bg-red-50"
                    )}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-1 pb-1">
                  <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <button className={cn(
                      "w-full py-2.5 rounded-xl text-[13px] font-medium transition-all",
                      isTop && isHome
                        ? "border border-white/20 text-white hover:bg-white/10"
                        : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                    )}>
                      Log in
                    </button>
                  </Link>
                  <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <button className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white transition-all hover:from-emerald-400 hover:to-emerald-500 shadow-sm">
                      Sign up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}