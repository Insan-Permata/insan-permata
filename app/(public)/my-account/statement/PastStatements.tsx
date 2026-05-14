import { Download } from 'lucide-react';
import type { ContributionStatement } from '@/lib/repositories/statements.repository';

interface PastStatementsProps {
    statements: ContributionStatement[];
}

function formatTotal(dollars: number, currency: string): string {
    try {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(dollars);
    } catch {
        return `${currency.toUpperCase()} ${dollars.toFixed(2)}`;
    }
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function PastStatements({ statements }: PastStatementsProps) {
    if (statements.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-foreground mb-1">Past Statements</h3>
            <p className="text-sm text-foreground/60 mb-6">Download any previously generated statement.</p>

            <div className="divide-y divide-gray-100">
                {statements.map((stmt) => (
                    <div key={stmt.id} className="flex items-center justify-between py-3 gap-4">
                        <div className="min-w-0">
                            <p className="font-semibold text-foreground text-sm">{stmt.year} Contribution Statement</p>
                            <p className="text-xs text-foreground/50 mt-0.5">
                                {formatTotal(stmt.total_amount, stmt.currency)} · Generated {formatDate(stmt.generated_at)}
                            </p>
                            <p className="text-xs text-foreground/30 mt-0.5 font-mono">{stmt.id}</p>
                        </div>
                        <a
                            href={`/api/statement/${stmt.id}/download`}
                            download={`insan-permata-${stmt.year}-statement.pdf`}
                            className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-[#355872] hover:opacity-70 transition-opacity border border-[#355872]/30 rounded-lg px-3 py-2"
                        >
                            <Download className="w-3.5 h-3.5" />
                            PDF
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
