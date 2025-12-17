import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'LegaldocsGPT',
    description: 'LegaldocsGPT App',
};

export default function RootLayout({
   children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <UserProvider>
            <Navbar />
            <main className="pt-16 min-h-screen bg-white">
                {children}
            </main>
            <footer className="text-center py-8 bg-text-DEFAULT text-white">
                <p>&copy; {new Date().getFullYear()} LegaldocsGPT. All rights reserved.</p>
            </footer>
        </UserProvider>
        </body>
        </html>
    );
}