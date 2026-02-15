"use client";
import { useParams } from 'next/navigation';
import StatusHandler from '@/components/StatusHandler';

export default function DocumentEditorPage() {
    const { id } = useParams();

    return (
        <main className="container mx-auto py-10 px-4">
            <StatusHandler jobId={id as string} />
        </main>
    );
}