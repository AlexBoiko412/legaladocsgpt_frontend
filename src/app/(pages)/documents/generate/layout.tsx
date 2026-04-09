import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'New Document | LegaldocsGPT',
};

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
