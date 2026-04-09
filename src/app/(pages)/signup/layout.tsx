import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Account | LegaldocsGPT',
    description: 'Sign up for LegaldocsGPT and start generating professional legal documents with AI.',
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
