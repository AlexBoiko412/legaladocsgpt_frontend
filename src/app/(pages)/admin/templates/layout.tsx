import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Template Management | LegaldocsGPT',
    robots: { index: false },
};

export default function AdminTemplatesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
