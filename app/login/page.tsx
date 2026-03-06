'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const username = formData.get('username') as string
        const password = formData.get('password') as string

        setIsLoading(true)
        setError(null)

        try {
            // TODO: Replace this with a real login call.
            // Example:
            //   const result = await userLogin(username, password)
            //   if (result?.error) { setError(result.error); return; }
            //   router.push('/')
            await new Promise((r) => setTimeout(r, 600)) // stub delay
            console.log('Login stub called with:', { username, password })
        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Top accent */}
                    <div className="h-1.5 bg-brown" />

                    <div className="p-8">
                        {/* Header */}
                        <div className="flex flex-col items-center mb-8">
                            <Link
                                href="/"
                                className="w-14 h-14 bg-brown rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 hover:opacity-90 transition-opacity"
                            >
                                IP
                            </Link>
                            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
                            <p className="text-foreground/60 mt-1 text-sm text-center">
                                Sign in to your Insan Permata account
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
                                    {error}
                                </div>
                            )}

                            {/* Username */}
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-foreground mb-1.5"
                                >
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    autoComplete="username"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent transition-all outline-none text-sm"
                                    placeholder="Enter your username"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-foreground mb-1.5"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent transition-all outline-none text-sm"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brown transition-colors p-1"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brown text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Signing in…
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <p className="text-center text-sm text-foreground/50 mt-6">
                            Don&apos;t have an account?{' '}
                            <span className="text-foreground/50 cursor-not-allowed">
                                {/* TODO: link to registration page when ready */}
                                Contact us
                            </span>
                        </p>
                    </div>
                </div>

                <p className="text-center text-xs text-foreground/40 mt-4">
                    Are you an admin?{' '}
                    <Link href="/admin/login" className="text-brown hover:underline">
                        Admin login →
                    </Link>
                </p>
            </div>
        </div>
    )
}
