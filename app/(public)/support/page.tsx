'use client';

import { useState } from 'react';
import PageHero from '../(component)/PageHero';

export default function SupportPage() {
  const [donationType, setDonationType] = useState<'once' | 'monthly'>('once');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(25);
  const [customAmount, setCustomAmount] = useState<string>('25');
  const [amountError, setAmountError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string>('');

  const presetAmounts = [10, 25, 100];

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (!value) {
      setEmailError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
    setAmountError('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);

    const numValue = parseFloat(value);
    if (value && numValue < 5) {
      setAmountError('Minimum donation amount is $5.00');
    } else {
      setAmountError('');
    }
  };

  const handleDonation = async () => {
    const amount = selectedAmount || parseFloat(customAmount);

    if (!amount || amount < 5) {
      setAmountError('Please enter a valid amount (minimum $5.00)');
      return;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, amount, type: donationType }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      // Redirect to Stripe Checkout — this leaves our site
      window.location.href = data.url;
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      {/* Hero Section */}
      <PageHero
        imageSrc="/home_bg_photos/2.jpg"
        imageAlt="Support Insan Permata"
        title="Support Our Mission"
        height="60vh"
        overlayOpacity={0.5}
      />

      {/* Introduction Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        {/* <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#292826] mb-6">
            Make a Difference in a Child's Life
          </h2>
          <p className="text-lg text-[#292826] opacity-80 leading-relaxed">
            Your generous support helps us provide a safe, nurturing home for children in need.
            Every contribution, no matter the size, makes a real impact on the lives of the children
            we care for at Panti Asuhan Insan Permata.
          </p>
        </div> */}

        {/* Impact Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="text-4xl font-bold text-[#292826] mb-2">50+</div>
            <p className="text-[#292826] opacity-70">Children Cared For</p>
          </div>
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="text-4xl font-bold text-[#292826] mb-2">20+</div>
            <p className="text-[#292826] opacity-70">Years of Service</p>
          </div>
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="text-4xl font-bold text-[#292826] mb-2">100%</div>
            <p className="text-[#292826] opacity-70">Goes to Children</p>
          </div>
        </div> */}

        {/* Donation Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#292826] text-center mb-4">
            Join the Story God Is Writing
          </h2>
          <p className="text-center text-[#292826] opacity-70 mb-8">
            As part of our commitment to transparency and relationship, donors receive secure access to our private supporter page.

            Inside, you can follow updates, stories, and reports about the children and staff of Insan Permata.

            Login details will be emailed to you after your donation is received.
          </p>

          {/* Donation Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
            {/* One-time vs Monthly Toggle */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setDonationType('once')}
                className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${donationType === 'once'
                  ? 'bg-[#355872] text-white'
                  : 'bg-gray-100 text-[#292826] hover:bg-gray-200'
                  }`}
              >
                Give once
              </button>
              <button
                onClick={() => setDonationType('monthly')}
                className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${donationType === 'monthly'
                  ? 'bg-[#355872] text-white'
                  : 'bg-gray-100 text-[#292826] hover:bg-gray-200'
                  }`}
              >
                Monthly
                {donationType === 'monthly' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="   M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>

            {donationType === 'monthly' && (
              <p className="text-center text-sm text-[#292826] opacity-70 mb-6 flex items-center justify-center gap-2">
                <span>Boost your impact by giving monthly</span>
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </p>
            )}

            {/* Preset Amount Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`py-4 px-6 rounded-xl font-semibold text-lg transition-all ${selectedAmount === amount
                    ? 'bg-[#355872] text-white ring-2 ring-[#355872] ring-offset-2'
                    : 'bg-gray-50 text-[#292826] border-2 border-gray-200 hover:border-[#355872]'
                    }`}
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="mb-6">
              <div className={`relative border-2 rounded-xl overflow-hidden transition-all ${customAmount && !selectedAmount
                ? 'border-[#355872] ring-2 ring-[#355872] ring-offset-2'
                : amountError
                  ? 'border-red-500'
                  : 'border-gray-200'
                }`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#292826]">
                  $
                </div>
                <input
                  type="number"
                  min="5"
                  step="1"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  placeholder="Custom amount"
                  className="w-full pl-12 pr-4 py-4 text-2xl font-bold text-[#292826] outline-none bg-transparent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#292826] opacity-50">
                  USD
                </div>
              </div>

              {amountError && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{amountError}</span>
                </div>
              )}

              {!amountError && !customAmount && (
                <p className="mt-2 text-sm text-[#292826] opacity-50">
                  Minimum donation amount is $5.00
                </p>
              )}
            </div>

            {/* Email Address Input */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-[#292826] opacity-70 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className={`relative border-2 rounded-xl overflow-hidden transition-all ${email && !emailError
                ? 'border-[#355872] ring-2 ring-[#355872] ring-offset-2'
                : emailError
                  ? 'border-red-500'
                  : 'border-gray-200'
                }`}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-4 text-lg font-semibold text-[#292826] outline-none bg-transparent"
                  required
                />
              </div>
              {emailError && (
                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{emailError}</span>
                </div>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{serverError}</span>
              </div>
            )}

            {/* Donate Button */}
            <button
              onClick={handleDonation}
              disabled={isLoading || (!selectedAmount && !customAmount) || !!amountError || !email || !!emailError}
              className="w-full bg-[#355872] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#7AAACE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Redirecting to Stripe...
                </>
              ) : (
                donationType === 'monthly' ? 'Donate Monthly' : 'Donate Now'
              )}
            </button>

            {/* Info Text */}
            <p className="text-center text-xs text-[#292826] opacity-50 mt-4">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>

        {/* Your Impact Section */}
        {/* <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm mb-16">
          <h2 className="text-3xl font-bold text-[#292826] text-center mb-8">
            Where Your Donation Goes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#355872] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#292826] mb-2">Safe Housing</h3>
                <p className="text-[#292826] opacity-70">
                  Maintaining a safe, clean, and comfortable home environment for all children
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#355872] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#292826] mb-2">Education</h3>
                <p className="text-[#292826] opacity-70">
                  School fees, books, uniforms, and educational materials for every child
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#355872] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#292826] mb-2">Healthcare</h3>
                <p className="text-[#292826] opacity-70">
                  Medical checkups, treatments, and ensuring the health and wellbeing of every child
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#355872] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#292826] mb-2">Nutrition</h3>
                <p className="text-[#292826] opacity-70">
                  Three nutritious meals daily and healthy snacks for growing children
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Other Ways to Support */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#292826] text-center mb-8">
            Other Ways to Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-[#355872] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#292826] mb-3">Volunteer Your Time</h3>
              <p className="text-[#292826] opacity-70 mb-4">
                Share your skills and time with our children. Tutoring, mentoring, or helping with activities.
              </p>
              <a href="/contact" className="text-[#355872] font-medium underline hover:no-underline">
                Learn More
              </a>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-[#355872] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#292826] mb-3">Donate Goods</h3>
              <p className="text-[#292826] opacity-70 mb-4">
                Clothing, books, toys, and other items are always welcome and appreciated.
              </p>
              <a href="/contact" className="text-[#355872] font-medium underline hover:no-underline">
                Contact Us
              </a>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-[#355872] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#292826] mb-3">Spread the Word</h3>
              <p className="text-[#292826] opacity-70 mb-4">
                Share our mission with friends and family. Every voice helps raise awareness.
              </p>
              <a href="/contact" className="text-[#355872] font-medium underline hover:no-underline">
                Get Involved
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        {/* <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm">
          <h2 className="text-3xl font-bold text-[#292826] text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-[#292826] mb-2">
                Is my donation tax-deductible?
              </h3>
              <p className="text-[#292826] opacity-70">
                Yes, Panti Asuhan Insan Permata is a registered non-profit organization.
                You will receive a receipt for tax purposes after your donation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#292826] mb-2">
                How will I know my donation is being used properly?
              </h3>
              <p className="text-[#292826] opacity-70">
                We provide regular updates to our donors and maintain full transparency in our operations.
                100% of donations go directly to supporting the children and facility.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#292826] mb-2">
                Can I visit the orphanage?
              </h3>
              <p className="text-[#292826] opacity-70">
                Yes! We welcome visitors. Please contact us in advance to schedule a visit so we can
                ensure the best experience for both you and our children.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#292826] mb-2">
                Can I sponsor a specific child?
              </h3>
              <p className="text-[#292826] opacity-70">
                We appreciate your interest in child sponsorship. Please contact us directly to discuss
                sponsorship opportunities and learn more about how you can make a lasting impact.
              </p>
            </div>
          </div>
        </div> */}
      </section>
    </div>
  );
}

