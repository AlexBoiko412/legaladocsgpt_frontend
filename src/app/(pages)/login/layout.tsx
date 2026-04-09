import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign In | LegaldocsGPT',
    description: 'Sign in to your LegaldocsGPT account to access your legal documents.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
