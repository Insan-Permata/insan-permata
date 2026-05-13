import Link from 'next/link';
import { ArrowLeft, FileText, Download, Info } from 'lucide-react';
import PageHero from '../../(component)/PageHero';
import Breadcrumbs from '../../(component)/Breadcrumbs';
import { getMyDonations } from '@/lib/repositories/donations.repository';
import StatementForm from './StatementForm';

export const dynamic = 'force-dynamic';

export default async function StatementPage() {
    const donations = await getMyDonations();

    const availableYears = Array.from(
        new Set(donations.map((d) => new Date(d.created_at).getFullYear()))
    ).sort((a, b) => b - a);

    const currentYear = new Date().getFullYear();
    // Fallback: if no donations on file yet, still offer the current and previous year
    const yearsToOffer = availableYears.length > 0
        ? availableYears
        : [currentYear, currentYear - 1];

    return (
        <div className="min-h-screen bg-background">
            <PageHero
                imageSrc="/home_bg_photos/2.jpg"
                imageAlt="Year-End Contribution Statement"
                title="Contribution Statement"
                height="30vh"
                overlayOpacity={0.5}
            />

            <Breadcrumbs />

            <section className="max-w-3xl mx-auto px-6 py-12">
                <Link
                    href="/my-account"
                    className="inline-flex items-center gap-2 text-foreground/60 hover:text-brown transition-colors mb-6 text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to My Account
                </Link>

                <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-[#355872]/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-7 h-7 text-[#355872]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-normal tracking-tight text-foreground">
                                Year-End Contribution Statement
                            </h2>
                            <p className="text-foreground/60 text-sm mt-1">
                                Generate an official summary of your donations for tax purposes.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
                        <Info className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-900 leading-relaxed">
                            The statement includes every paid donation tied to your email
                            address for the selected year. It can be used as a record for
                            tax-deductible contributions.
                        </p>
                    </div>

                    <StatementForm years={yearsToOffer} />

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-xs text-foreground/50 flex items-start gap-2">
                            <Download className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            Downloads are generated as PDF. If you don&apos;t see a donation
                            you expected, please reach out via our contact page.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
