"use client";

import { Facebook, Instagram, Mail, Phone } from 'lucide-react';

export default function FooterComponent() {
  const currentYear = new Date().getFullYear();
  const copyrightText = `© ${currentYear} Insan Permata`;
  const facebookUrl = 'https://facebook.com';
  const instagramUrl = 'https://instagram.com';
  const phoneNumber = '+62 812 3456 7890';
  const email = 'info@insanpermata.org';

  return (
    <footer className="relative z-10 bg-[#F1F0EE] py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Tagline */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-semibold text-lg text-[#292826]">Insan Permata</span>
            </div>
            <p className="text-sm text-[#292826] leading-relaxed max-w-md opacity-90">
              Ephesians 2:10 - "For we are God’s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do."
            </p>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold text-sm text-[#292826] mb-4">Connect With Us</h3>

            {/* Contact Info */}
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm text-[#292826] opacity-90">
                <Phone className="h-4 w-4 text-[#355872]" />
                <span>{phoneNumber}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#292826] opacity-90">
                <Mail className="h-4 w-4 text-[#355872]" />
                <span>{email}</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex items-center gap-3">
              <button
                className="h-9 w-9 rounded-md bg-[#355872] flex items-center justify-center hover:bg-[#2a4a61] transition-colors duration-200"
                onClick={() => window.open(facebookUrl, '_blank')}
                aria-label="Visit our Facebook page"
              >
                <Facebook className="h-4 w-4 text-[#F5F5F3]" />
              </button>
              <button
                className="h-9 w-9 rounded-md bg-[#355872] flex items-center justify-center hover:bg-[#2a4a61] transition-colors duration-200"
                onClick={() => window.open(instagramUrl, '_blank')}
                aria-label="Visit our Instagram page"
              >
                <Instagram className="h-4 w-4 text-[#F5F5F3]" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#292826] border-opacity-10">
          <p className="text-xs text-[#292826] text-center opacity-80">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}