"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LogIn, LogOut } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Frontend-only auth helpers
// Replace these stubs with real logic when the backend is ready.
// ─────────────────────────────────────────────────────────────

/** Check whether the user is currently logged in. */
function checkIsLoggedIn(): boolean {
  // TODO: Replace with a real session/cookie check.
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("user_logged_in") === "true";
}

/** Sign the user out. */
async function signOut(): Promise<void> {
  // TODO: Call your real logout API/server action here.
  sessionStorage.removeItem("user_logged_in");
}

// ─────────────────────────────────────────────────────────────

export default function HeaderComponent() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Sync auth state on mount and whenever the route changes
  useEffect(() => {
    setIsLoggedIn(checkIsLoggedIn());
  }, [pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsLoggedIn(false);
    setIsSigningOut(false);
    router.push("/");
  };

  const navLinks = [
    { href: "/our-children", label: "Our Children" },
    { href: "/news", label: "News" },
    { href: "/support", label: "How to Support" },
    { href: "/meet-the-staff", label: "Meet the Staff" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-100">
      <nav className="container mx-auto px-6 py-4 relative">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="text-foreground text-2xl font-bold tracking-tight hover:text-brown transition-colors duration-300"
          >
            Insan Permata
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative text-base font-medium transition-colors duration-300 py-2 group ${isActive
                        ? "text-brown"
                        : "text-foreground hover:text-brown"
                      }`}
                  >
                    {link.label}
                    {/* Animated underline */}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-brown transition-all duration-300 ease-out ${isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                    />
                  </Link>
                </li>
              );
            })}

            {/* ── Login / Logout ── */}
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex items-center gap-1.5 text-base font-medium text-foreground hover:text-brown transition-colors duration-300 disabled:opacity-60"
                >
                  <LogOut className="w-4 h-4" />
                  {isSigningOut ? "Signing out…" : "Sign Out"}
                </button>
              </li>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 bg-brown text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground hover:text-brown transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div
          className={`absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg md:hidden transition-all duration-300 ease-in-out origin-top ${isMobileMenuOpen
              ? "opacity-100 scale-y-100 visible"
              : "opacity-0 scale-y-0 invisible"
            }`}
        >
          <div className="flex flex-col px-6 py-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-lg font-medium py-3 border-b border-gray-50 last:border-0 transition-colors ${isActive
                      ? "text-brown pl-2"
                      : "text-foreground hover:text-brown hover:pl-2"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* ── Mobile Login / Logout ── */}
            {isLoggedIn ? (
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex items-center gap-2 text-lg font-medium py-3 text-foreground hover:text-brown transition-colors disabled:opacity-60"
              >
                <LogOut className="w-4 h-4" />
                {isSigningOut ? "Signing out…" : "Sign Out"}
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-lg font-medium py-3 text-brown"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}