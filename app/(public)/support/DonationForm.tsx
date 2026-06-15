'use client';

import { useCallback, useState } from 'react';
import Turnstile from '../(component)/Turnstile';

const MAX_AMOUNT = 10000;
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

type Props = {
  accountEmail?: string;
};

export default function DonationForm({ accountEmail }: Props) {
  const isEmailLocked = Boolean(accountEmail);

  const [donationType, setDonationType] = useState<'once' | 'monthly'>('monthly');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(20);
  const [customAmount, setCustomAmount] = useState<string>('20');
  const [amountError, setAmountError] = useState<string>('');
  const [email, setEmail] = useState<string>(accountEmail ?? '');
  const [emailError, setEmailError] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string>('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const handleTurnstileToken = useCallback((token: string | null) => {
    setTurnstileToken(token);
  }, []);

  const presetAmounts = [10, 20, 40];

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

  const handleNameChange = (value: string) => {
    setFullName(value);
    if (!value.trim()) {
      setNameError('Name is required');
    } else {
      setNameError('');
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
    } else if (value && numValue > MAX_AMOUNT) {
      setAmountError(`Maximum donation amount is $${MAX_AMOUNT.toLocaleString()}.00. For larger gifts, please contact us.`);
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

    if (amount > MAX_AMOUNT) {
      setAmountError(`Maximum donation amount is $${MAX_AMOUNT.toLocaleString()}.00. For larger gifts, please contact us.`);
      return;
    }

    if (!isEmailLocked && (!email || !/\S+@\S+\.\S+/.test(email))) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!fullName.trim()) {
      setNameError('Name is required');
      return;
    }

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setServerError('Please complete the security check before donating.');
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName: fullName.trim(),
          amount,
          type: donationType,
          turnstileToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      window.location.href = data.url;
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-normal tracking-tight text-[#292826] text-center mb-4">
        Join the Story God Is Writing
      </h2>
      <p className="text-center text-[#292826] opacity-70 mb-8">
        As part of our commitment to transparency and relationship, donors receive secure access to our private supporter page.

        Inside, you can follow occasional updates and stories from the children and staff of Insan Permata.

        Login details will be emailed to you after your donation is received.
      </p>

      {/* Donation Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
        {/* One-time vs Monthly Toggle */}
        <div className="flex gap-3 mb-6">
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
          <button
            onClick={() => setDonationType('once')}
            className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${donationType === 'once'
              ? 'bg-[#355872] text-white'
              : 'bg-gray-100 text-[#292826] hover:bg-gray-200'
              }`}
          >
            Give once
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

        {/* Full Name Input */}
        <div className="mb-6">
          <label htmlFor="fullName" className="block text-sm font-medium text-[#292826] opacity-70 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className={`relative border-2 rounded-xl overflow-hidden transition-all ${fullName && !nameError
            ? 'border-[#355872] ring-2 ring-[#355872] ring-offset-2'
            : nameError
              ? 'border-red-500'
              : 'border-gray-200'
            }`}>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="John Doe"
              autoComplete="name"
              className="w-full px-4 py-4 text-lg font-semibold text-[#292826] outline-none bg-transparent"
              required
            />
          </div>
          {nameError ? (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{nameError}</span>
            </div>
          ) : (
            <p className="mt-2 text-xs text-[#292826] opacity-50">
              This name (not the card name) appears on your year-end statement.
            </p>
          )}
        </div>

        {/* Email Address Input */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-[#292826] opacity-70 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className={`relative border-2 rounded-xl overflow-hidden transition-all ${isEmailLocked
            ? 'border-gray-200 bg-gray-50'
            : email && !emailError
              ? 'border-[#355872] ring-2 ring-[#355872] ring-offset-2'
              : emailError
                ? 'border-red-500'
                : 'border-gray-200'
            }`}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={isEmailLocked ? undefined : (e) => handleEmailChange(e.target.value)}
              readOnly={isEmailLocked}
              placeholder="your@email.com"
              className={`w-full px-4 py-4 text-lg font-semibold text-[#292826] outline-none bg-transparent ${isEmailLocked ? 'cursor-default select-none' : ''}`}
              required
            />
          </div>
          {isEmailLocked ? (
            <p className="mt-2 text-xs text-[#292826] opacity-50">
              Donation will be recorded to your account email.
            </p>
          ) : emailError ? (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{emailError}</span>
            </div>
          ) : null}
        </div>

        {/* Turnstile bot check (only renders if a site key is configured) */}
        {TURNSTILE_SITE_KEY && (
          <div className="mb-6 flex justify-center">
            <Turnstile siteKey={TURNSTILE_SITE_KEY} onToken={handleTurnstileToken} />
          </div>
        )}

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
          disabled={isLoading || (!selectedAmount && !customAmount) || !!amountError || (!isEmailLocked && (!email || !!emailError)) || !fullName.trim() || !!nameError}
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
  );
}
