'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 3000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/home_bg_photos/1.jpg"
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F5F5F3] mb-4 drop-shadow-lg">Contact Us</h1>
          <p className="text-lg text-[#F5F5F3] opacity-90 max-w-2xl mx-auto drop-shadow-md">
            We'd love to hear from you. Reach out to us with any questions, concerns, or ways you'd like to help.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Address Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#292826] rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#292826] mb-2">Visit Us</h3>
            <p className="text-[#292826] opacity-70">
              Panti Asuhan Insan Permata<br />
              Pekanbaru, Riau<br />
              Indonesia
            </p>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#292826] rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#292826] mb-2">Call Us</h3>
            <p className="text-[#292826] opacity-70">
              +62 XXX XXXX XXXX<br />
              <span className="text-sm">Mon - Fri, 9AM - 5PM</span>
            </p>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#292826] rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#292826] mb-2">Email Us</h3>
            <p className="text-[#292826] opacity-70">
              info@insanpermata.org<br />
              <span className="text-sm">We'll respond within 24 hours</span>
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#292826] mb-6">Send us a Message</h2>

            {formStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">Thank you for your message! We'll get back to you soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#292826] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#292826] focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#292826] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#292826] focus:border-transparent outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#292826] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#292826] focus:border-transparent outline-none transition-all"
                  placeholder="+62 XXX XXXX XXXX"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#292826] mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#292826] focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="donation">Donation Information</option>
                  <option value="volunteer">Volunteer Opportunities</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#292826] mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#292826] focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="w-full bg-[#292826] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#3d3b38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Office Hours & Additional Info */}
          <div className="space-y-6">
            {/* Office Hours */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#292826] mb-6">Office Hours</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-[#292826]">Monday - Friday</span>
                  <span className="text-[#292826] opacity-70">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="font-medium text-[#292826]">Saturday</span>
                  <span className="text-[#292826] opacity-70">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-[#292826]">Sunday</span>
                  <span className="text-[#292826] opacity-70">Closed</span>
                </div>
              </div>
            </div>

            {/* FAQ or Quick Info */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#292826] mb-6">Quick Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-[#292826] mb-2">Want to Visit?</h3>
                  <p className="text-[#292826] opacity-70 text-sm">
                    We welcome visitors! Please contact us in advance to schedule your visit.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#292826] mb-2">Looking to Donate?</h3>
                  <p className="text-[#292826] opacity-70 text-sm">
                    Visit our <a href="/support" className="text-[#292826] underline hover:no-underline">Support page</a> for donation options and information.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#292826] mb-2">Media Inquiries</h3>
                  <p className="text-[#292826] opacity-70 text-sm">
                    For press and media inquiries, please email us directly with "MEDIA" in the subject line.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-2xl font-bold text-[#292826] mb-6 px-4 pt-4">Find Us</h2>
          <div className="w-full overflow-hidden rounded-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.6475506937386!2d101.32625327496473!3d0.5301123994647041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5015574521203%3A0xc050ec3a54d465d8!2sPanti%20Asuhan%20Insan%20Permata!5e0!3m2!1sen!2sid!4v1764088056938!5m2!1sen!2sid"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

