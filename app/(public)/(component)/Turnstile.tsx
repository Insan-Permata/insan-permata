'use client';

import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        turnstile?: {
            render: (
                container: HTMLElement,
                options: {
                    sitekey: string;
                    callback?: (token: string) => void;
                    'expired-callback'?: () => void;
                    'error-callback'?: () => void;
                    theme?: 'auto' | 'light' | 'dark';
                    size?: 'normal' | 'compact' | 'flexible';
                }
            ) => string;
            reset: (widgetId?: string) => void;
            remove: (widgetId?: string) => void;
        };
    }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

interface TurnstileProps {
    siteKey: string;
    onToken: (token: string | null) => void;
}

/**
 * Minimal Cloudflare Turnstile widget — loads the official script once, renders
 * the widget into a div, and bubbles the token up to the parent form.
 *
 * The token is single-use and short-lived; verify it server-side at the same
 * request it was issued for (see /api/stripe/create-checkout-session).
 */
export default function Turnstile({ siteKey, onToken }: TurnstileProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!siteKey || !containerRef.current) return;

        let cancelled = false;

        const render = () => {
            if (cancelled || !containerRef.current || !window.turnstile) return;
            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: siteKey,
                callback: (token: string) => onToken(token),
                'expired-callback': () => onToken(null),
                'error-callback': () => onToken(null),
            });
        };

        if (window.turnstile) {
            render();
        } else if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
            const script = document.createElement('script');
            script.src = SCRIPT_SRC;
            script.async = true;
            script.defer = true;
            script.onload = render;
            document.head.appendChild(script);
        } else {
            // Script tag exists but turnstile global isn't ready — poll briefly.
            const interval = setInterval(() => {
                if (window.turnstile) {
                    clearInterval(interval);
                    render();
                }
            }, 100);
            return () => {
                cancelled = true;
                clearInterval(interval);
            };
        }

        return () => {
            cancelled = true;
            if (widgetIdRef.current && window.turnstile) {
                try { window.turnstile.remove(widgetIdRef.current); } catch { /* noop */ }
                widgetIdRef.current = null;
            }
        };
    }, [siteKey, onToken]);

    return <div ref={containerRef} />;
}
