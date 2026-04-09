import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Documents | LegaldocsGPT',
};

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
