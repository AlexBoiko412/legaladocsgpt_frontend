import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reset Password | LegaldocsGPT',
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
