"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, LogIn, LogOut, LayoutDashboard, UserCircle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { UserRole } from "@/types/users";

// Links visible to everyone
const PUBLIC_NAV_LINKS = [
  { href: "/support", label: "How to Support" },
  { href: "/contact", label: "Contact" },
];

// Links only shown when the user is logged in
const MEMBER_NAV_LINKS = [
  { href: "/our-children", label: "Our Children" },
  { href: "/news", label: "News" },
  { href: "/meet-the-staff", label: "Meet the Staff" },
];

export default function HeaderComponent() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isAtTop, setIsAtTop] = useState(false);
  const [scrollThreshold, setScrollThreshold] = useState(0);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchUserRole = async (userId: string) => {
    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();
    setIsAdmin((data?.role as UserRole) === "admin");
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session?.user) fetchUserRole(session.user.id);
    });

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const update = () => {
      const hero = document.querySelector('[data-hero]') as HTMLElement | null;
      const threshold = hero ? hero.offsetHeight - 80 : 0;
      setScrollThreshold(threshold);
      setIsAtTop(window.scrollY < threshold);
    };
    const timer = setTimeout(update, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsAtTop(window.scrollY < scrollThreshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollThreshold]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsSigningOut(false);
    router.push("/");
    router.refresh();
  };

  const navLinks = isLoggedIn
    ? [...PUBLIC_NAV_LINKS, ...MEMBER_NAV_LINKS]
    : PUBLIC_NAV_LINKS;

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={`relative text-base font-medium transition-colors duration-300 py-2 group ${
          isAtTop
            ? isActive ? "text-white" : "text-white/80 hover:text-white"
            : isActive ? "text-brown" : "text-foreground hover:text-brown"
        }`}
      >
        {label}
        <span
          className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-out ${
            isAtTop ? "bg-white" : "bg-brown"
          } ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
        />
      </Link>
    );
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isAtTop
        ? "bg-transparent border-transparent"
        : "bg-background/80 backdrop-blur-md border-b border-gray-100"
    }`}>
      <nav className="container mx-auto px-6 py-4 relative">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className={`text-2xl font-normal tracking-tight transition-colors duration-300 ${
              isAtTop ? "text-white hover:text-white/80" : "text-foreground hover:text-brown"
            }`}
          >
            Insan Permata
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href} label={link.label} />
              </li>
            ))}

            {/* My Account button (only for logged-in non-admin users) */}
            {isLoggedIn && !isAdmin && (
              <li>
                <Link
                  href="/my-account"
                  className={`flex items-center gap-1.5 text-base font-medium transition-colors duration-300 ${
                    isAtTop
                      ? "text-white/80 hover:text-white"
                      : pathname === "/my-account" || pathname.startsWith("/my-account/")
                        ? "text-brown"
                        : "text-foreground hover:text-brown"
                  }`}
                >
                  <UserCircle className="w-4 h-4" />
                  My Account
                </Link>
              </li>
            )}

            {/* Admin Dashboard button (only for admins) */}
            {isAdmin && (
              <li>
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center gap-1.5 text-base font-medium transition-colors duration-300 ${
                    isAtTop ? "text-white/80 hover:text-white" : "text-foreground hover:text-brown"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </li>
            )}

            {/* Login / Logout */}
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className={`flex items-center gap-1.5 text-base font-medium transition-colors duration-300 disabled:opacity-60 ${
                    isAtTop ? "text-white/80 hover:text-white" : "text-foreground hover:text-brown"
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  {isSigningOut ? "Signing out…" : "Sign Out"}
                </button>
              </li>
            ) : (
              <li>
                <Link
                  href="/login"
                  className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${
                    isAtTop
                      ? "border border-white text-white hover:bg-[#355872] hover:border-[#355872]"
                      : "bg-brown text-white hover:opacity-90"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden p-2 transition-colors ${
              isAtTop ? "text-white hover:text-white/80" : "text-foreground hover:text-brown"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div
          className={`absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg md:hidden transition-all duration-300 ease-in-out origin-top ${
            isMobileMenuOpen
              ? "opacity-100 scale-y-100 visible"
              : "opacity-0 scale-y-0 invisible"
          }`}
        >
          <div className="flex flex-col px-6 py-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-lg font-medium py-3 border-b border-gray-50 last:border-0 transition-colors ${
                    isActive
                      ? "text-brown pl-2"
                      : "text-foreground hover:text-brown hover:pl-2"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* My Account (mobile, non-admin only) */}
            {isLoggedIn && !isAdmin && (
              <Link
                href="/my-account"
                className={`flex items-center gap-2 text-lg font-medium py-3 border-b border-gray-50 transition-colors ${
                  pathname === "/my-account" || pathname.startsWith("/my-account/")
                    ? "text-brown pl-2"
                    : "text-foreground hover:text-brown hover:pl-2"
                }`}
              >
                <UserCircle className="w-4 h-4" />
                My Account
              </Link>
            )}

            {/* Admin Dashboard (mobile) */}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 text-lg font-medium py-3 border-b border-gray-50 text-foreground hover:text-brown hover:pl-2 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}

            {/* Mobile Login / Logout */}
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