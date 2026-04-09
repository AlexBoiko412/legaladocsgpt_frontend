import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/UserContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: 'LegaldocsGPT - AI Legal Document Generation',
    description: 'Generate professionally structured legal documents in minutes using AI and expert templates.',
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={inter.variable}>
        <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
            <UserProvider>
                <Navbar />
                <main className="pt-16 min-h-screen bg-white">
                    {children}
                </main>
                <footer className="bg-slate-900 text-slate-400 text-sm py-8 px-4">
                    <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p>&copy; {new Date().getFullYear()} LegaldocsGPT. All rights reserved.</p>
                        <div className="flex gap-5">
                            <a href="/terms" className="hover:text-slate-300 transition-colors">Terms</a>
                            <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</a>
                        </div>
                    </div>
                </footer>
                <CookieBanner />
            </UserProvider>
        </ErrorBoundary>
        </body>
        </html>
    );
}
