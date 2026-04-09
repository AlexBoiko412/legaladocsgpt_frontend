import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Document Editor | LegaldocsGPT',
};

export default function DocumentEditorLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
