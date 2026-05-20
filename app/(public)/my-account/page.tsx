import Link from 'next/link';
import { FileText, Heart, Mail, Calendar, Clock, Download } from 'lucide-react';
import PageHero from '../(component)/PageHero';
import Breadcrumbs from '../(component)/Breadcrumbs';
import { createClient } from '@/lib/utils/supabase/server';
import { getMyDonations } from '@/lib/repositories/donations.repository';
import { getMyStatements } from '@/lib/repositories/statements.repository';

export const dynamic = 'force-dynamic';

function formatAmount(amountInCents: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
    }).format(amountInCents / 100);
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatDollarAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
    }).format(amount);
}

export default async function MyAccountPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const [donations, statements] = await Promise.all([
        getMyDonations(),
        getMyStatements(),
    ]);

    const totalGiven = donations.reduce((sum, d) => sum + d.amount, 0);
    const currency = donations[0]?.currency ?? 'usd';

    const yearsWithDonations = Array.from(
        new Set(donations.map((d) => new Date(d.created_at).getFullYear()))
    ).sort((a, b) => b - a);

    return (
        <div className="min-h-screen bg-background">
            <PageHero
                imageSrc="/home_bg_photos/2.jpg"
                imageAlt="My Account"
                title="My Account"
                height="30vh"
                overlayOpacity={0.5}
            />

            <Breadcrumbs />

            <section className="max-w-6xl mx-auto px-6 py-12">
                {/* Profile summary */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-2xl font-normal tracking-tight text-foreground mb-4">Account Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brown/10 flex items-center justify-center flex-shrink-0">
                                <Mail className="w-5 h-5 text-brown" />
                            </div>
                            <div>
                                <p className="text-sm text-foreground/60">Email</p>
                                <p className="font-semibold text-foreground break-all">{user?.email ?? '—'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brown/10 flex items-center justify-center flex-shrink-0">
                                <Heart className="w-5 h-5 text-brown" />
                            </div>
                            <div>
                                <p className="text-sm text-foreground/60">Total Given</p>
                                <p className="font-semibold text-foreground">
                                    {donations.length > 0 ? formatAmount(totalGiven, currency) : '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Year-end statement card */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#355872]/10 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-6 h-6 text-[#355872]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-normal tracking-tight text-foreground mb-1">
                                    Year-End Contribution Statement
                                </h2>
                                <p className="text-foreground/60 text-sm">
                                    Download a summary of your tax-deductible donations for a given year.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/my-account/statement"
                            className="inline-flex items-center justify-center gap-2 bg-[#355872] text-white font-semibold px-5 py-3 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
                        >
                            <FileText className="w-4 h-4" />
                            Generate Statement
                        </Link>
                    </div>

                    {yearsWithDonations.length > 0 && (
                        <div className="mt-5 pt-5 border-t border-gray-100">
                            <p className="text-sm text-foreground/60 mb-3">
                                Donations on file for:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {yearsWithDonations.map((year) => (
                                    <span
                                        key={year}
                                        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full"
                                    >
                                        <Calendar className="w-3.5 h-3.5" />
                                        {year}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Generated statements */}
                {statements.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                        <div className="p-6 md:p-8 border-b border-gray-100">
                            <h2 className="text-2xl font-normal tracking-tight text-foreground">Generated Statements</h2>
                            <p className="text-foreground/60 text-sm mt-1">
                                Previously generated year-end contribution statements.
                            </p>
                        </div>

                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left text-xs font-semibold uppercase tracking-wide text-foreground/60 px-6 py-3">Statement ID</th>
                                        <th className="text-left text-xs font-semibold uppercase tracking-wide text-foreground/60 px-6 py-3">Year</th>
                                        <th className="text-right text-xs font-semibold uppercase tracking-wide text-foreground/60 px-6 py-3">Total</th>
                                        <th className="text-left text-xs font-semibold uppercase tracking-wide text-foreground/60 px-6 py-3">Generated</th>
                                        <th className="text-right text-xs font-semibold uppercase tracking-wide text-foreground/60 px-6 py-3">Download</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {statements.map((s) => (
                                        <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-foreground/80">{s.id}</td>
                                            <td className="px-6 py-4 text-sm text-foreground">{s.year}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-foreground text-right">
                                                {formatDollarAmount(s.total_amount, s.currency)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-foreground/60">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                                    {formatDateTime(s.generated_at)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <a
                                                    href={`/api/statement/${s.id}/download`}
                                                    download={`insan-permata-${s.year}-statement.pdf`}
                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#355872] hover:opacity-70 transition-opacity border border-[#355872]/30 rounded-lg px-3 py-1.5"
                                                    aria-label={`Download ${s.year} statement`}
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    PDF
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile card list */}
                        <ul className="md:hidden divide-y divide-gray-100">
                            {statements.map((s) => (
                                <li key={s.id} className="p-5">
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-foreground">{formatDollarAmount(s.total_amount, s.currency)}</p>
                                            <p className="text-sm text-foreground/60">Tax year {s.year}</p>
                                        </div>
                                        <a
                                            href={`/api/statement/${s.id}/download`}
                                            download={`insan-permata-${s.year}-statement.pdf`}
                                            className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-[#355872] hover:opacity-70 transition-opacity border border-[#355872]/30 rounded-lg px-3 py-1.5"
                                            aria-label={`Download ${s.year} statement`}
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            PDF
                                        </a>
                                    </div>
                                    <p className="font-mono text-xs text-foreground/50 mb-1 break-all">{s.id}</p>
                                    <p className="text-xs text-foreground/50 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDateTime(s.generated_at)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Donation history */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-gray-100">
                        <h2 className="text-2xl font-normal tracking-tight text-foreground">Donation History</h2>
                        <p className="text-foreground/60 text-sm mt-1">
                            All donations made with this email address.
                        </p>
                    </div>

                    {donations.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-foreground/40" />
                            </div>
                            <p className="text-foreground/60 mb-4">
                                You haven&apos;t made any donations yet.
                            </p>
                            <Link
                                href="/support"
                                className="inline-flex items-center gap-2 text-[#355872] font-semibold hover:underline"
                            >
                                Make your first donation
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Desktop table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="text-left text-xs font-semibold uppercase tracking-wide text-foreground/60 px-6 py-3">
                                                Date
                                            </th>
                                            <th className="text-left text-xs font-semibold uppercase tracking-wide text-foreground/60 px-6 py-3">
                                                Type
                                            </th>
                                            <th className="text-right text-xs font-semibold uppercase tracking-wide text-foreground/60 px-6 py-3">
                                                Amount
                                            </th>
                                            <th className="text-left text-xs font-semibold uppercase tracking-wide text-foreground/60 px-6 py-3">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {donations.map((d) => (
                                            <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-foreground">
                                                    {formatDate(d.created_at)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-foreground capitalize">
                                                    {d.type === 'subscription' ? 'Monthly' : 'One-time'}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-foreground text-right">
                                                    {formatAmount(d.amount, d.currency)}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 capitalize">
                                                        {d.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile card list */}
                            <ul className="md:hidden divide-y divide-gray-100">
                                {donations.map((d) => (
                                    <li key={d.id} className="p-5">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-semibold text-foreground">
                                                    {formatAmount(d.amount, d.currency)}
                                                </p>
                                                <p className="text-sm text-foreground/60 capitalize">
                                                    {d.type === 'subscription' ? 'Monthly' : 'One-time'}
                                                </p>
                                            </div>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 capitalize">
                                                {d.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-foreground/50">
                                            {formatDate(d.created_at)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
