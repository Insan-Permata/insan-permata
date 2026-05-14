'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Calendar, CheckCircle, Download } from 'lucide-react';
import { generateStatement } from '@/lib/actions/statement.actions';

interface StatementFormProps {
    years: number[];
}

type Notice =
    | { type: 'success'; statementId: string; year: number }
    | { type: 'error'; message: string };

export default function StatementForm({ years }: StatementFormProps) {
    const router = useRouter();
    const [selectedYear, setSelectedYear] = useState<number>(years[0]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [notice, setNotice] = useState<Notice | null>(null);

    const triggerDownload = (statementId: string, year: number) => {
        const a = document.createElement('a');
        a.href = `/api/statement/${statementId}/download`;
        a.download = `insan-permata-${year}-statement.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setNotice(null);

        const result = await generateStatement(selectedYear);

        if (result.success) {
            setNotice({ type: 'success', statementId: result.statementId, year: selectedYear });
            triggerDownload(result.statementId, selectedYear);
            router.refresh();
        } else {
            setNotice({ type: 'error', message: result.error });
        }

        setIsGenerating(false);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-foreground/70 mb-3">
                Select tax year
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {years.map((year) => (
                    <button
                        key={year}
                        type="button"
                        onClick={() => { setSelectedYear(year); setNotice(null); }}
                        className={`relative py-3 px-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
                            selectedYear === year
                                ? 'bg-[#355872] text-white ring-2 ring-[#355872] ring-offset-2'
                                : 'bg-gray-50 text-foreground border-2 border-gray-200 hover:border-[#355872]'
                        }`}
                    >
                        <Calendar className="w-4 h-4" />
                        {year}
                    </button>
                ))}
            </div>

            <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-[#355872] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isGenerating ? (
                    <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Generating & downloading…
                    </>
                ) : (
                    <>
                        <FileText className="w-5 h-5" />
                        Generate &amp; Download {selectedYear} Statement
                    </>
                )}
            </button>

            {notice?.type === 'success' && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-green-800">Your {notice.year} statement is downloading</p>
                        <p className="text-xs text-green-700 mt-1">
                            Didn&apos;t start?{' '}
                            <a
                                href={`/api/statement/${notice.statementId}/download`}
                                className="inline-flex items-center gap-1 underline font-medium"
                            >
                                <Download className="w-3 h-3" />
                                Click here to download again
                            </a>
                        </p>
                    </div>
                </div>
            )}

            {notice?.type === 'error' && (
                <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {notice.message}
                </p>
            )}
        </div>
    );
}
