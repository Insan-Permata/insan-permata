import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { ContributionStatement } from '@/lib/repositories/statements.repository';
import type { Donation } from '@/lib/repositories/donations.repository';

const NAVY = '#355872';
const MUTED = '#666666';
const LIGHT = '#999999';
const BORDER = '#e5e7eb';
const ROW_ALT = '#f9fafb';

const s = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 9,
        color: '#1a1a1a',
        paddingTop: 48,
        paddingBottom: 64,
        paddingHorizontal: 48,
        backgroundColor: '#ffffff',
    },

    // ── Header ──────────────────────────────────────────────
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    orgName: { fontFamily: 'Helvetica-Bold', fontSize: 18, color: NAVY },
    einText: { fontSize: 8, color: MUTED, textAlign: 'right', marginTop: 4 },
    orgMeta: { fontSize: 7.5, color: MUTED, lineHeight: 1.6 },
    headerDivider: { borderBottomWidth: 2, borderBottomColor: NAVY, marginBottom: 18 },

    // ── Title block ─────────────────────────────────────────
    titleBlock: { marginBottom: 16 },
    titleText: { fontFamily: 'Helvetica-Bold', fontSize: 13, color: NAVY, letterSpacing: 0.3, marginBottom: 4 },
    titleMeta: { flexDirection: 'row', justifyContent: 'space-between' },
    titleMetaText: { fontSize: 8, color: MUTED },

    // ── Donor box ───────────────────────────────────────────
    donorBox: { backgroundColor: '#f1f5f9', padding: 12, marginBottom: 18 },
    donorLabel: { fontFamily: 'Helvetica-Bold', fontSize: 6.5, color: LIGHT, marginBottom: 4 },
    donorName: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: '#1a1a1a', marginBottom: 2 },
    donorEmail: { fontSize: 8, color: MUTED },

    // ── Table ───────────────────────────────────────────────
    tableLabel: { fontFamily: 'Helvetica-Bold', fontSize: 7, color: LIGHT, marginBottom: 6 },
    tableHeaderRow: { flexDirection: 'row', backgroundColor: NAVY, paddingVertical: 7, paddingHorizontal: 8 },
    tableHeaderCell: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: '#ffffff' },
    tableDataRow: { flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: BORDER },
    tableDataCell: { fontSize: 8.5, color: '#1a1a1a' },
    colDate: { width: '22%' },
    colType: { width: '42%' },
    colAmount: { width: '36%', textAlign: 'right' },

    // ── Summary ─────────────────────────────────────────────
    summaryBar: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: NAVY, paddingVertical: 9, paddingHorizontal: 10, marginBottom: 22 },
    summaryLabel: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: '#ffffff', marginRight: 24 },
    summaryAmount: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: '#ffffff' },

    // ── Disclaimer ──────────────────────────────────────────
    disclaimerBlock: { borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 12, marginBottom: 14 },
    disclaimerText: { fontSize: 7.5, color: MUTED, lineHeight: 1.7, fontFamily: 'Helvetica-Oblique' },

    // ── Warm message ────────────────────────────────────────
    warmText: { fontSize: 8.5, color: MUTED, lineHeight: 1.85, fontFamily: 'Helvetica-Oblique' },

    // ── Footer ──────────────────────────────────────────────
    footer: {
        position: 'absolute',
        bottom: 28,
        left: 48,
        right: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: BORDER,
        paddingTop: 7,
    },
    footerText: { fontSize: 7, color: LIGHT },
});

function formatAmount(cents: number, currency: string): string {
    try {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100);
    } catch {
        return `${currency.toUpperCase()} ${(cents / 100).toFixed(2)}`;
    }
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

function formatType(type: string): string {
    const base = type === 'subscription' ? 'Monthly Donation' : 'One-Time Donation';
    return `${base} – in support of Panti Asuhan Insan Permata`;
}

const ORG_NAME = 'Acts Ministries International';
const EIN = process.env.EMPLOYER_IDENTIFICATION_NUMBER ?? 'EIN Not Set';
const ORG_ADDRESS = '1380 S. Sanderson Ave\nAnaheim, CA 92806 · United States';
const ORG_CONTACT = 'amichurches.com · info@amichurches.com';

interface Props {
    statement: ContributionStatement;
    donations: Donation[];
}

export default function StatementDocument({ statement, donations }: Props) {
    const taxPeriod = `January 1, ${statement.year} – December 31, ${statement.year}`;
    const issueDate = formatDate(statement.generated_at);
    const donorDisplay = statement.donor_name ?? statement.email;

    return (
        <Document
            title={`Acts Ministries International Contribution Statement ${statement.year}`}
            author={ORG_NAME}
        >
            <Page size="A4" style={s.page}>

                {/* Header */}
                <View style={s.headerRow}>
                    <View>
                        <Text style={s.orgName}>{ORG_NAME}</Text>
                        <Text style={s.orgMeta}>{ORG_ADDRESS}</Text>
                        <Text style={s.orgMeta}><Link src="https://amichurches.com" style={{ color: MUTED }}>amichurches.com</Link> · info@amichurches.com</Text>
                    </View>
                    <View>
                        <Text style={s.einText}>EIN: {EIN}</Text>
                    </View>
                </View>
                <View style={s.headerDivider} />

                {/* Title */}
                <View style={s.titleBlock}>
                    <Text style={s.titleText}>ANNUAL CONTRIBUTION STATEMENT</Text>
                    <Text style={{ fontSize: 7, color: LIGHT, marginBottom: 6, fontFamily: 'Helvetica' }}>Statement ID: {statement.id}</Text>
                    <View style={s.titleMeta}>
                        <Text style={s.titleMetaText}>Tax Year: {taxPeriod}</Text>
                        <Text style={s.titleMetaText}>Issued: {issueDate}</Text>
                    </View>
                </View>

                {/* Donor box */}
                <View style={s.donorBox}>
                    <Text style={s.donorLabel}>PREPARED FOR</Text>
                    <Text style={s.donorName}>{donorDisplay}</Text>
                    {statement.donor_name && (
                        <Text style={s.donorEmail}>{statement.email}</Text>
                    )}
                </View>

                {/* Table */}
                <Text style={s.tableLabel}>CONTRIBUTION HISTORY</Text>
                <View style={s.tableHeaderRow}>
                    <Text style={[s.tableHeaderCell, s.colDate]}>DATE</Text>
                    <Text style={[s.tableHeaderCell, s.colType]}>DESCRIPTION</Text>
                    <Text style={[s.tableHeaderCell, s.colAmount]}>AMOUNT</Text>
                </View>

                {donations.length === 0 ? (
                    <View style={[s.tableDataRow, { paddingVertical: 12 }]}>
                        <Text style={[s.tableDataCell, { color: MUTED }]}>No transactions found for this statement.</Text>
                    </View>
                ) : (
                    donations.map((d, i) => (
                        <View key={d.id} style={[s.tableDataRow, i % 2 !== 0 ? { backgroundColor: ROW_ALT } : {}]}>
                            <Text style={[s.tableDataCell, s.colDate]}>{formatDate(d.created_at)}</Text>
                            <Text style={[s.tableDataCell, s.colType]}>{formatType(d.type)}</Text>
                            <Text style={[s.tableDataCell, s.colAmount]}>{formatAmount(d.amount, d.currency)}</Text>
                        </View>
                    ))
                )}

                {/* Summary */}
                <View style={s.summaryBar}>
                    <Text style={s.summaryLabel}>TOTAL CONTRIBUTIONS</Text>
                    <Text style={s.summaryAmount}>{formatTotal(statement.total_amount, statement.currency)}</Text>
                </View>

                {/* Disclaimer */}
                <View style={s.disclaimerBlock}>
                    <Text style={s.disclaimerText}>
                        {ORG_NAME} is a tax-exempt organization under Section 501(c)(3) of the U.S. Internal
                        Revenue Code (EIN above). No goods or services were provided in exchange for these
                        contributions. Contributions are tax-deductible to the extent allowed by law; please
                        retain this statement for your tax records. {ORG_NAME} raises and grants funds, at its
                        sole discretion, in support of Panti Asuhan Insan Permata, a children&apos;s home in
                        Pekanbaru, Indonesia. This gift was made through insanpermata.org.
                    </Text>
                </View>

                {/* Warm message */}
                <Text style={s.warmText}>
                    Thank you for standing with Insan Permata. Your generosity goes far beyond a financial
                    contribution and carries hope, dignity, and a brighter future to every child in our care.
                </Text>

                {/* Footer */}
                <View style={s.footer} fixed>
                    <Text style={s.footerText}>{ORG_NAME} · <Link src="https://amichurches.com" style={{ color: LIGHT }}>amichurches.com</Link></Text>
                    <Text style={s.footerText}>Statement ID: {statement.id}</Text>
                    <Text style={s.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
                </View>

            </Page>
        </Document>
    );
}
