"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderComponent() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/our-children", label: "Our Children" },
    { href: "/news", label: "News" },
    { href: "/support", label: "How to Support" },
    { href: "/meet-the-staff", label: "Meet the Staff" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-[#F5F5F3]/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Left side - Brand name */}
          <Link 
            href="/" 
            className="text-[#292826] text-2xl font-medium hover:text-[#8E521E] transition-colors duration-200"
          >
            Insan Permata
          </Link>

          {/* Right side - Navigation links */}
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-[#8E521E] font-semibold"
                        : "text-[#292826] hover:text-[#8E521E]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}