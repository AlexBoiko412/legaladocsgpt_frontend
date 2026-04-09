import type { Metadata } from 'next';
import Link from 'next/link';
import { Scale } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy | LegaldocsGPT',
    description: 'Learn how LegaldocsGPT collects, uses, and protects your personal data.',
};

const LAST_UPDATED = 'April 9, 2026';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <div className="text-slate-600 leading-relaxed space-y-2">{children}</div>
        </section>
    );
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200">
                <div className="mx-auto max-w-3xl px-6 py-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium mb-6">
                        <Scale size={16} />
                        LegaldocsGPT
                    </Link>
                    <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
                    <p className="mt-2 text-slate-500 text-sm">Last updated: {LAST_UPDATED}</p>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-3xl px-6 py-12 space-y-10">

                <p className="text-slate-600 leading-relaxed">
                    LegaldocsGPT (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to
                    protecting your personal information. This Privacy Policy explains what data we collect,
                    how we use it, and your rights over it.
                </p>

                <Section title="1. Information We Collect">
                    <p><strong>Account data:</strong> When you register, we collect your username, email
                    address, and (for password accounts) a hashed password. Google OAuth accounts store
                    your Google profile identifier.</p>
                    <p><strong>Document data:</strong> We store the documents you generate, including the
                    inputs you provide to templates and the AI-generated output.</p>
                    <p><strong>Usage data:</strong> We may collect logs of actions taken in the Service
                    (document generation, edits, exports) for security and quality purposes.</p>
                    <p><strong>Cookies:</strong> We use a session cookie (&ldquo;token&rdquo;) strictly
                    necessary to keep you signed in. We do not use advertising or tracking cookies.</p>
                </Section>

                <Section title="2. How We Use Your Information">
                    <ul className="list-disc pl-5 space-y-1">
                        <li>To provide, maintain, and improve the Service</li>
                        <li>To authenticate your sessions securely</li>
                        <li>To generate and store documents you request</li>
                        <li>To respond to support requests</li>
                        <li>To detect and prevent abuse or unauthorized access</li>
                    </ul>
                    <p>We do not sell your personal data to third parties.</p>
                </Section>

                <Section title="3. Data Sharing">
                    <p>
                        We do not share your personal data with third parties except as required by law
                        or to operate the Service (e.g., cloud infrastructure providers under data
                        processing agreements). Any such providers are bound by confidentiality obligations.
                    </p>
                </Section>

                <Section title="4. Data Retention">
                    <p>
                        We retain your account data and documents for as long as your account is active.
                        You may request deletion of your account and associated data at any time by
                        contacting{' '}
                        <a href="mailto:support@legaldocsgpt.com" className="text-indigo-600 hover:underline">
                            support@legaldocsgpt.com
                        </a>
                        . We will process deletion requests within 30 days.
                    </p>
                </Section>

                <Section title="5. Your Rights">
                    <p>Depending on your location, you may have the right to:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Access the personal data we hold about you</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request deletion of your data</li>
                        <li>Object to or restrict certain processing</li>
                        <li>Data portability (receive your data in a structured format)</li>
                    </ul>
                    <p>
                        To exercise any of these rights, contact us at{' '}
                        <a href="mailto:support@legaldocsgpt.com" className="text-indigo-600 hover:underline">
                            support@legaldocsgpt.com
                        </a>
                        .
                    </p>
                </Section>

                <Section title="6. Security">
                    <p>
                        We implement industry-standard security measures including HTTPS, httpOnly session
                        cookies, Content Security Policy headers, and access controls. No system is
                        completely secure; if you suspect a security incident, contact us immediately.
                    </p>
                </Section>

                <Section title="7. Children">
                    <p>
                        The Service is not directed to children under 18. We do not knowingly collect
                        personal data from minors. If you believe we have inadvertently collected such data,
                        contact us for immediate deletion.
                    </p>
                </Section>

                <Section title="8. Changes to This Policy">
                    <p>
                        We may update this Privacy Policy periodically. We will notify you of material
                        changes by posting the updated policy and revising the &ldquo;Last updated&rdquo;
                        date. Your continued use of the Service constitutes acceptance of the revised policy.
                    </p>
                </Section>

                <Section title="9. Contact">
                    <p>
                        Privacy questions or requests:{' '}
                        <a href="mailto:privacy@legaldocsgpt.com" className="text-indigo-600 hover:underline">
                            privacy@legaldocsgpt.com
                        </a>
                    </p>
                </Section>

                <div className="border-t border-slate-200 pt-8 text-sm text-slate-400 flex gap-6">
                    <Link href="/terms" className="hover:text-slate-600">Terms of Service</Link>
                    <Link href="/" className="hover:text-slate-600">Home</Link>
                </div>
            </div>
        </div>
    );
}
