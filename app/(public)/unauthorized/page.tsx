import Link from "next/link";
import { ShieldOff, LogIn } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-brown/10 flex items-center justify-center">
                        <ShieldOff className="w-12 h-12 text-brown" />
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-bold text-foreground mb-3">
                    Unauthorized
                </h1>

                {/* Message */}
                <p className="text-foreground/60 text-base leading-relaxed mb-8">
                    This page is only available to logged-in members of Insan Permata.
                    Please sign in to continue.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 bg-brown text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity duration-200"
                    >
                        <LogIn className="w-4 h-4" />
                        Sign In
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 border border-foreground/20 text-foreground font-semibold px-6 py-3 rounded-lg hover:bg-foreground/5 transition-colors duration-200"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
