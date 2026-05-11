'use client';

import { useState } from 'react';
import { FileText, Calendar } from 'lucide-react';

interface StatementFormProps {
    years: number[];
}

export default function StatementForm({ years }: StatementFormProps) {
    const [selectedYear, setSelectedYear] = useState<number>(years[0]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [notice, setNotice] = useState<string>('');

    const handleGenerate = async () => {
        setIsGenerating(true);
        setNotice('');

        // TODO: wire up to a real generation endpoint
        // e.g. window.location.href = `/api/donations/statement?year=${selectedYear}`
        await new Promise((resolve) => setTimeout(resolve, 600));

        setNotice(
            `Statement generation for ${selectedYear} isn't available yet — this will be enabled soon.`
        );
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
                        onClick={() => setSelectedYear(year)}
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
                        Generating…
                    </>
                ) : (
                    <>
                        <FileText className="w-5 h-5" />
                        Generate {selectedYear} Statement
                    </>
                )}
            </button>

            {notice && (
                <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                    {notice}
                </p>
            )}
        </div>
    );
}
