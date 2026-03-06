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
          <div className="absolute inset-0 bg-black/60"></div>
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
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#292826] mb-6">Send us a Message</h2>

          {formStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">Thank you for your message! We&apos;ll get back to you soon.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row: Name / Email / Phone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#355872] focus:border-transparent outline-none transition-all"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#355872] focus:border-transparent outline-none transition-all"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#355872] focus:border-transparent outline-none transition-all"
                  placeholder="+62 XXX XXXX XXXX"
                />
              </div>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#355872] focus:border-transparent outline-none transition-all"
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
                rows={7}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#355872] focus:border-transparent outline-none transition-all resize-none"
                placeholder="Tell us how we can help you..."
              />
            </div>

            <button
              type="submit"
              disabled={formStatus === 'submitting'}
              className="w-full bg-[#355872] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#2a4a61] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
