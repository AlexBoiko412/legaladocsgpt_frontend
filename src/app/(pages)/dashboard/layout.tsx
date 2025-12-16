import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'LegaldocsGPT ',
    description: 'LegaldocsGPT App',
};

export default function Layout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}