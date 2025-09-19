import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from "@/components/Navbar";
import {headers} from "next/headers";


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'LegaldocsGPT ',
    description: 'LegaldocsGPT App',
};

export default async function RootLayout({
   children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const h = await headers();
    const userHeader = h.get("x-user-info");

    let user = null;
    if (userHeader) {
        try {
            user = JSON.parse(userHeader);
        } catch (err) {
            console.error("Failed to parse x-user-info:", err);
        }
    }

    return (
        <html lang="en">
        <body className={inter.className}>
            <Navbar initialUser={user}/>

            {children}
        </body>
        </html>
    );
}