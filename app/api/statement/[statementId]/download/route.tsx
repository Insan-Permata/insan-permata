import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createClient } from '@/lib/utils/supabase/server';
import { createAdminClient } from '@/lib/utils/supabase/admin';
import StatementDocument from '@/lib/pdf/StatementDocument';
import type { ContributionStatement } from '@/lib/repositories/statements.repository';
import type { Donation } from '@/lib/repositories/donations.repository';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ statementId: string }> }
) {
    const { statementId } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createAdminClient();

    const { data: statement, error: stmtError } = await admin
        .from('contribution_statements')
        .select('*')
        .eq('id', statementId)
        .single();

    if (stmtError || !statement) {
        return NextResponse.json({ error: 'Statement not found' }, { status: 404 });
    }

    const stmt = statement as ContributionStatement;

    if (stmt.email.toLowerCase() !== user.email?.toLowerCase()) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let donations: Donation[] = [];
    if (stmt.donation_ids.length > 0) {
        const { data } = await admin
            .from('donations')
            .select('*')
            .in('id', stmt.donation_ids)
            .order('created_at', { ascending: true });
        donations = (data ?? []) as Donation[];
    }

    let buffer: Buffer;
    try {
        buffer = await renderToBuffer(
            <StatementDocument statement={stmt} donations={donations} />
        );
    } catch (err) {
        console.error('[statement/download] renderToBuffer failed:', err);
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }

    return new NextResponse(new Uint8Array(buffer), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="insan-permata-${stmt.year}-statement.pdf"`,
            'Cache-Control': 'no-store',
        },
    });
}
