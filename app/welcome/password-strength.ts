// Shared password strength check used by both the server action and the
// client-side meter. Kept deliberately small (no zxcvbn dependency) — donors
// just need a sensible floor, not enterprise-grade.

const COMMON_PASSWORDS = new Set([
    'password', 'password1', '12345678', '123456789', '1234567890',
    'qwerty123', 'qwertyuiop', 'iloveyou', 'admin123', 'welcome1',
    'letmein123', 'changeme', 'passw0rd', 'p@ssw0rd', 'monkey123',
])

export type StrengthLevel = 'too-short' | 'weak' | 'fair' | 'good' | 'strong'

export interface StrengthResult {
    level: StrengthLevel
    score: number       // 0-4
    ok: boolean         // passes the server-side floor
    reason: string      // human-friendly reason if not ok (empty otherwise)
}

export function checkPasswordStrength(password: string): StrengthResult {
    const pw = password ?? ''

    if (pw.length < 12) {
        return {
            level: 'too-short',
            score: 0,
            ok: false,
            reason: 'Password must be at least 12 characters long.',
        }
    }

    if (COMMON_PASSWORDS.has(pw.toLowerCase())) {
        return {
            level: 'weak',
            score: 1,
            ok: false,
            reason: 'This password is too common. Please choose a less guessable one.',
        }
    }

    const hasLower = /[a-z]/.test(pw)
    const hasUpper = /[A-Z]/.test(pw)
    const hasDigit = /\d/.test(pw)
    const hasSymbol = /[^A-Za-z0-9]/.test(pw)
    const classes = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length

    if (classes < 3) {
        return {
            level: 'weak',
            score: 1,
            ok: false,
            reason: 'Use at least three of: lowercase, uppercase, numbers, symbols.',
        }
    }

    // From here on, the password meets the floor — grade it for UI feedback.
    let score = 2
    if (pw.length >= 14) score = 3
    if (pw.length >= 16 && classes === 4) score = 4

    const level: StrengthLevel = score >= 4 ? 'strong' : score >= 3 ? 'good' : 'fair'

    return { level, score, ok: true, reason: '' }
}
