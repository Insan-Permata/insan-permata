'use client';

import { Mail, MessageCircle, Instagram, MapPin } from 'lucide-react';

const WHATSAPP_NUMBER = '6285163540045';
const EMAIL = 'info@insanpermata.org';
const INSTAGRAM_URL = 'https://www.instagram.com/insanpermata_home/';

export default function ContactPage() {
  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello, I'd like to get in touch with Insan Permata.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const openEmail = () => {
    window.location.href = `mailto:${EMAIL}`;
  };

  const openInstagram = () => {
    window.open(INSTAGRAM_URL, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      {/* Hero Section */}
      <div data-hero className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/home_bg_photos/1.jpg"
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight text-[#F5F5F3] mb-4 drop-shadow-lg">Get in Touch</h1>
          <p className="text-lg text-[#F5F5F3] opacity-90 max-w-2xl mx-auto drop-shadow-md">
            We&apos;d love to hear from you. Whether you have a question, want to volunteer, or simply want to learn more about our work.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        {/* Contact Channels */}
        <section>
          <h2 className="text-2xl font-normal tracking-tight text-[#292826] text-center mb-3">Reach Us Directly</h2>
          <p className="text-center text-[#292826] opacity-60 mb-10 max-w-xl mx-auto">
            We&apos;d love to connect. Reach out through any of the channels below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* WhatsApp */}
            <button
              onClick={openWhatsApp}
              className="group bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-all text-left border border-transparent hover:border-[#355872]/20"
            >
              <div className="w-12 h-12 bg-[#355872] rounded-xl flex items-center justify-center mb-5">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#292826] text-lg mb-2">WhatsApp</h3>
              <p className="text-sm text-[#292826] opacity-60 mb-4 leading-relaxed">
                Best for quick questions, volunteering inquiries, or arranging a visit.
              </p>
              <span className="text-sm font-medium text-[#355872] group-hover:underline">
                Open WhatsApp →
              </span>
            </button>

            {/* Email */}
            <button
              onClick={openEmail}
              className="group bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-all text-left border border-transparent hover:border-[#355872]/20"
            >
              <div className="w-12 h-12 bg-[#355872] rounded-xl flex items-center justify-center mb-5">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#292826] text-lg mb-2">Email</h3>
              <p className="text-sm text-[#292826] opacity-60 mb-4 leading-relaxed">
                For formal inquiries, partnerships, or detailed questions about our programs.
              </p>
              <span className="text-sm font-medium text-[#355872] group-hover:underline">
                {EMAIL} →
              </span>
            </button>

            {/* Instagram */}
            <button
              onClick={openInstagram}
              className="group bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-all text-left border border-transparent hover:border-[#355872]/20"
            >
              <div className="w-12 h-12 bg-[#355872] rounded-xl flex items-center justify-center mb-5">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-[#292826] text-lg mb-2">Instagram</h3>
              <p className="text-sm text-[#292826] opacity-60 mb-4 leading-relaxed">
                Follow our journey, see daily life at the home, and send us a DM.
              </p>
              <span className="text-sm font-medium text-[#355872] group-hover:underline">
                @insanpermata_home →
              </span>
            </button>
          </div>
        </section>

        {/* Visit Us */}
        <section className="bg-[#355872] rounded-2xl p-8 md:p-12 text-white">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-normal tracking-tight mb-1">Visit Us</h2>
              <p className="text-white/70 text-sm">Pekanbaru, Indonesia</p>
            </div>
          </div>
          <p className="text-white/80 leading-relaxed mb-6 max-w-2xl">
            Our home is located in Pekanbaru, Indonesia. We warmly welcome visitors, whether you&apos;re a donor, a potential volunteer, or simply curious about our work. To protect the privacy and routine of our children, visits are by prior arrangement only.
          </p>
          <p className="text-white/80 leading-relaxed max-w-2xl">
            Reach out via WhatsApp or email to schedule a visit and we&apos;ll share the details with you directly.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={openWhatsApp}
              className="bg-white text-[#355872] px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-[#F5F5F3] transition-colors"
            >
              Schedule via WhatsApp
            </button>
            <button
              onClick={openEmail}
              className="bg-white/20 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-white/30 transition-colors"
            >
              Schedule via Email
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
