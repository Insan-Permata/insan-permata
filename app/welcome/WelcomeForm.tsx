'use client'

import { useState } from 'react'
import { Loader2, Eye, EyeOff, Heart } from 'lucide-react'
import Link from 'next/link'
import { setInitialPassword } from './actions'

interface WelcomeFormProps {
    email: string
}

export default function WelcomeForm({ email }: WelcomeFormProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        setError(null)

        const result = await setInitialPassword(formData)

        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
        // On success the server action redirects to /my-account
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="h-1.5 bg-brown" />

                    <div className="p-8">
                        <div className="flex flex-col items-center mb-8">
                            <Link
                                href="/"
                                className="w-14 h-14 bg-brown rounded-full flex items-center justify-center text-white mb-4 hover:opacity-90 transition-opacity"
                            >
                                <Heart className="w-6 h-6" />
                            </Link>
                            <h1 className="text-2xl font-bold text-foreground text-center">
                                Welcome to Insan Permata
                            </h1>
                            <p className="text-foreground/60 mt-2 text-sm text-center leading-relaxed">
                                Thank you for your generous donation. Set a password to access
                                your account and view your donation history anytime.
                            </p>
                        </div>

                        <form action={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
                                    {error}
                                </div>
                            )}

                            {/* Email (read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-foreground/70 text-sm cursor-not-allowed"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-foreground mb-1.5"
                                >
                                    Create Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        minLength={8}
                                        autoComplete="new-password"
                                        className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent transition-all outline-none text-sm"
                                        placeholder="At least 8 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brown transition-colors p-1"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm password */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-foreground mb-1.5"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent transition-all outline-none text-sm"
                                    placeholder="Re-enter your password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brown text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Setting up…
                                    </>
                                ) : (
                                    'Continue to My Account'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
